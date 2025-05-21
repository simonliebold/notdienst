module.exports = (models, sequelize) => {
  const router = require("express").Router()
  const roles = require("./../roles")

  // Get all
  router.get("/", roles.requireAdmin, async (req, res) => {
    const schedules = await models.Schedule.findAll({
      include: [models.Employee, models.Shift],
    })
    return res.send(schedules)
  })

  // Get all self
  router.get("/self", async (req, res) => {
    const schedules = await models.Schedule.findAll({
      include: {
        model: models.Employee,
        where: { id: req.user.id },
        attributes: [],
      },
    })
    return res.send({ schedules: schedules })
  })

  // Get one
  router.get("/:id", roles.requireAdmin, async (req, res) => {
    const schedule = await models.Schedule.findOne({
      where: { id: req.params.id },
      include: [models.Employee, models.Shift],
    })
    if (schedule === null) return res.sendStatus(404)
    const works = await models.Work.findAll({
      where: { scheduleId: req.params.id },
      include: [models.Employee],
    })
    return res.send({ ...schedule.dataValues, works })
  })

  // Create one
  router.post("/", roles.requireAdmin, async (req, res) => {
    try {
      const schedule = await models.Schedule.create({
        short: req.body.short,
        title: req.body.title,
        start: req.body.start,
        end: req.body.end,
        deadline: req.body.deadline,
      })
      return res.send(schedule)
    } catch (error) {
      return res.status(400).send({ error: error.message })
    }
  })

  // Update one
  router.put("/:id", roles.requireAdmin, async (req, res) => {
    try {
      const schedule = await models.Schedule.findByPk(req.params.id)
      await models.Schedule.update(
        {
          title: req.body.title,
          short: req.body.short,
          start: req.body.start,
          end: req.body.end,
          deadline: req.body.deadline,
        },
        {
          where: { id: req.params.id },
        }
      )

      if (req.body.employeeIds) {
        await models.ScheduleEmployee.destroy({
          where: { scheduleId: schedule.id },
        })
        await models.ScheduleEmployee.bulkCreate(
          req.body.employeeIds.map((employeeId) => {
            return { employeeId: employeeId, scheduleId: schedule.id }
          })
        )
      }
      if (req.body.shiftIds) {
        await models.ScheduleShift.destroy({
          where: { scheduleId: schedule.id },
        })
        await models.ScheduleShift.bulkCreate(
          req.body.shiftIds.map((shiftId) => {
            return { shiftId: shiftId, scheduleId: schedule.id }
          })
        )
      }
      // No update of workIds because the need to be associated to a schedule
      return res.status(200).send({ message: "Änderungen gespeichert" })
    } catch (error) {
      return res.status(400).send({ error: error.message })
    }
  })

  // Delete one
  router.delete("/:id", roles.requireAdmin, async (req, res) => {
    try {
      const response = await models.Schedule.destroy({
        where: { id: req.params.id },
      })
      if (response > 0)
        return res.status(200).send({ message: "Deleted successfully" })

      return res.sendStatus(404)
    } catch (error) {
      return res.status(400).send({ error: error.message })
    }
  })

  // update schedule employees
  router.put("/:id/employees", roles.requireAdmin, async (req, res) => {
    try {
      await models.ScheduleEmployee.destroy({
        where: { scheduleId: req.params.id },
      })

      const newEmployees =
        req.body?.values?.map((employeeId) => ({
          scheduleId: req.params.id,
          employeeId: employeeId,
        })) || []

      await models.ScheduleEmployee.bulkCreate(newEmployees)

      return res.send({ message: "Erfolgreich aktualisiert" })
    } catch (error) {
      return res.status(400).send({ error: error.message })
    }
  })

  // update schedule shifts
  router.put("/:id/shifts", roles.requireAdmin, async (req, res) => {
    try {
      await models.ScheduleShift.destroy({
        where: { scheduleId: req.params.id },
      })

      const newShifts =
        req.body?.values?.map((shiftId) => ({
          scheduleId: req.params.id,
          shiftId: shiftId,
        })) || []

      await models.ScheduleShift.bulkCreate(newShifts)

      return res.send({ message: "Erfolgreich aktualisiert" })
    } catch (error) {
      return res.status(400).send({ error: error.message })
    }
  })

  const getSchedule = async (req, res, next) => {
    const schedule = await models.Schedule.findByPk(req.params.id)
    if (schedule === null) return res.sendStatus(404)
    req.schedule = schedule

    next()
  }

  const getEvents = async (req, res, next) => {
    const events = await models.Event.findAll({
      include: {
        model: models.Shift,
        include: [
          { model: models.Schedule, where: { id: req.params.id } },
          { model: models.Job, include: models.Employee },
        ],
        required: true,
      },
    })

    if (events.length === 0)
      return res.status(404).send({ error: "No events found" })

    const eventsObj = {}
    for (let event of events) {
      event = event.dataValues
      eventsObj[event.id] = event
    }
    req.events = eventsObj
    next()
  }

  const createWorks = async (req, res, next) => {
    const { count, rows } = await models.Work.findAndCountAll({
      where: { scheduleId: req.schedule.id },
    })
    if (count > 0)
      return res.status(400).send({
        error: "Es existieren bereits Dienste für diesen Schichtplan",
      })

    let works = []
    const first = new Date(req.schedule.start)
    const last = new Date(req.schedule.end)
    for (const eventInd in req.events) {
      const event = req.events[eventInd]
      const eventId = req.events[eventInd].id
      const timeStart = event.timeStart.split(":")
      const timeEnd = event.timeEnd.split(":")
      for (let i = new Date(first); i <= last; i.setDate(i.getDate() + 1)) {
        if (i.getDay() !== event.repeatWeekday) continue
        const start = new Date(i)
        start.setHours(timeStart[0], timeStart[1], timeStart[2])

        const end = new Date(i)
        if (timeStart[0] > timeEnd[0]) end.setDate(end.getDate() + 1)
        end.setHours(timeEnd[0], timeEnd[1], timeEnd[2])

        const duration = (end.getTime() - start.getTime()) / 3600000

        works.push({
          start: start,
          end: end,
          duration: duration,
          scheduleId: req.schedule.id,
          eventId: eventId,
        })
      }
    }
    req.works = await models.Work.bulkCreate(works)

    next()
  }

  // Create works
  router.post(
    "/:id/create",
    roles.requireAdmin,
    getSchedule,
    getEvents,
    createWorks,
    async (req, res) => {
      return res.send({ message: "Dienste erfolgreich generiert" })
    }
  )

  // Get employees
  const getEmployees = async (req, res, next) => {
    const employees = await models.Employee.findAll({
      include: [
        { model: models.Schedule, where: { id: req.params.id } },
        models.Employment,
      ],
    })

    const employeesObj = {}

    for (const employeeInd in employees) {
      const employee = employees[employeeInd].dataValues
      employee.minHours = employee.employment.minHours
      employee.maxHours = employee.employment.maxHours
      delete employee.schedules
      delete employee.employment
      employeesObj[employee.id] = {
        ...employee,
        possibleHours: 0,
        workHours: 0,
        freetimes: [],
      }
    }

    req.employees = employeesObj

    if (req.events !== undefined) {
      for (const eventInd in req.events) {
        const event = req.events[eventInd]
        const shift = event.shift.dataValues
        event.employees = {}
        for (const jobInd in shift.jobs) {
          const job = shift.jobs[jobInd].dataValues
          for (const employeeInd in job.employees) {
            const employee = job.employees[employeeInd].dataValues
            if (req.employees[employee.id] !== undefined)
              event.employees[employee.id] = employee
          }
        }
        req.events[eventInd] = event
      }
    }
    next()
  }

  // Get freetimes
  const getFreetimes = async (req, res, next) => {
    const freetimes = await models.Freetime.findAll({
      where: { scheduleId: req.params.id },
    })
    freetimes.forEach((freetime) => {
      if (req.employees[freetime.employeeId] !== undefined) {
        if (req.employees[freetime.employeeId]["freetimes"] !== undefined) {
          req.employees[freetime.employeeId]["freetimes"].push(freetime)
        }
      }
    })
    next()
  }

  // Add employee ids to works
  const checkAvailability = async (req, res, next) => {
    const works = await models.Work.findAll({
      where: { scheduleId: req.params.id },
    })
    if (works === undefined) return res.sendStatus(404)

    let workEmployees = []
    for (const workInd in works) {
      const work = works[workInd].dataValues
      const event = req.events[work.eventId]
      const start = new Date(work.start)
      const end = new Date(work.end)
      const duration = work.duration
      work.employeeIds = []
      for (const [employeeId, employee] of Object.entries(event.employees)) {
        const isFree = req.employees[employeeId].freetimes.every(
          (freetime) =>
            new Date(freetime.end).getTime() <= start.getTime() ||
            new Date(freetime.start).getTime() >= end.getTime()
        )
        if (isFree) {
          req.employees[employeeId].possibleHours += duration
          work.employeeIds.push(employeeId)
        }
      }
      workEmployees.push(work)
    }

    req.works = workEmployees
    next()
  }

  // Order works by possible employee count
  // TODO: order by possible hours count
  const orderWorks = (req, res, next) => {
    req.works.sort((a, b) => {
      if (a.employeeIds.length < b.employeeIds.length) return -1
      else if (a.employeeIds.length < b.employeeIds.length) return 1
      else return 0
    })
    next()
  }

  // Find employees for work
  // TODO: check event requiredEmployees
  const allocateWorks = async (req, res, next) => {
    let workEmployees = []
    while (req.works.length > 0) {
      let bestEmployee
      let bestEmployeeRemainingHours

      req.works[0].employeeIds.forEach((employeeId) => {
        const employee = req.employees[employeeId]
        employee.possibleHours -= req.works[0].duration
        let employeeRemainingHours = employee.maxHours
        if (employee.minHours !== null)
          employeeRemainingHours = employee.minHours - employee.workHours

        const newWorkHours = employee.workHours + req.works[0].duration

        const maxHoursCorrect =
          employee.maxHours === null || newWorkHours <= employee.maxHours
        const isBest =
          bestEmployee === undefined ||
          employeeRemainingHours >= bestEmployeeRemainingHours

        if (maxHoursCorrect && isBest) {
          bestEmployee = employee
          bestEmployeeRemainingHours = employeeRemainingHours
        }
      })
      workEmployees.push({
        workId: req.works[0].id,
        employeeId: bestEmployee.id,
      })
      bestEmployee.workHours += req.works[0].duration
      req.works.shift()
    }
    try {
      req.works = await models.WorkEmployee.bulkCreate(workEmployees)
      next()
    } catch (error) {
      return res.status(400).send({ error: "Dienste wurden bereits zugeteilt" })
    }
  }

  // Allocate works
  router.post(
    "/:id/allocate",
    roles.requireAdmin,
    getSchedule,
    getEvents,
    getEmployees,
    getFreetimes,
    checkAvailability,
    orderWorks,
    allocateWorks,
    async (req, res) => {
      return res.send({ message: "Dienste erfolgreich verteilt" })
    }
  )

  return router
}
