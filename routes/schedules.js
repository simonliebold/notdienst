module.exports = (models, sequelize) => {
  const router = require("express").Router()
  const roles = require("./../roles")

  // Get all
  router.get("/", roles.requireAdmin, async (req, res) => {
    const schedules = await models.Schedule.findAll()
    return res.send({ schedules: schedules })
  })

  // Get all self
  router.get("/self", async (req, res) => {
    const schedules = await models.Schedule.findAll({
      include: {
        model: models.Employee,
        where: { id: req.user.id },
        attributes: []
      },
    })
    return res.send({ schedules: schedules })
  })

  // Get one
  // TODO: also return employees and works
  router.get("/:id", roles.requireAdmin, async (req, res) => {
    const schedule = await models.Schedule.findByPk(req.params.id)
    if (schedule === null) return res.sendStatus(404)
    return res.send({ schedule: schedule })
  })

  // Create one
  // TODO: add employees
  // TODO: add shifts
  router.post("/", roles.requireAdmin, async (req, res) => {
    try {
      const schedule = await models.Schedule.create({ ...req.body })
      return res.send({ schedule: schedule })
    } catch (error) {
      return res.status(400).send({ error: error.message })
    }
  })

  // Update one
  router.put("/:id", roles.requireAdmin, async (req, res) => {
    try {
      const response = await models.Schedule.update(
        { ...req.body },
        {
          where: { id: req.params.id },
        }
      )
      if (response[0] > 0)
        return res.status(200).send({ message: "Updated successfully" })

      return res.sendStatus(404)
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

  // Get all employees from schedule
  // TODO: return employee table
  router.get("/:id/employee", roles.requireAdmin, async (req, res) => {
    const response = await models.ScheduleEmployee.findAll({
      where: { scheduleId: req.params.id },
    })
    return res.send({ response: response })
  })

  // Add Employees to Schedule
  router.post("/:id/employee", roles.requireAdmin, async (req, res) => {
    try {
      const response = await models.ScheduleEmployee.bulkCreate(
        req.body.employeeIds.map((employeeId) => ({
          scheduleId: req.params.id,
          employeeId: employeeId,
        }))
      )
      return res.send({ response: response })
    } catch (error) {
      return res.status(400).send({ error: error })
    }
  })

  // Delete Employees from Schedule
  router.delete("/:id/employee", roles.requireAdmin, async (req, res) => {
    try {
      const employeeIds = req.body.employeeIds.map((val) => {
        return { employeeId: val }
      })
      const response = await models.ScheduleEmployee.destroy({
        where: {
          [sequelize.Op.and]: [
            { scheduleId: req.params.id },
            {
              [sequelize.Op.or]: [...employeeIds],
            },
          ],
        },
      })
      response > 0
        ? res.status(200).send({ message: "Deleted successfully" })
        : res.status(404).send({ message: "Not found" })
    } catch (error) {
      return res.status(400).send({ error: error })
    }
  })

  // Get all shifts from schedule
  // TODO: return shift table
  router.get("/:id/shift", roles.requireAdmin, async (req, res) => {
    const response = await models.ScheduleShift.findAll({
      where: { scheduleId: req.params.id },
    })
    if (response.length === 0) return res.sendStatus(404)
    return res.send({ response: response })
  })

  // Add Shifts to Schedule
  router.post("/:id/shift", roles.requireAdmin, async (req, res) => {
    try {
      const response = await models.ScheduleShift.bulkCreate(
        req.body.shiftIds.map((shiftId) => ({
          scheduleId: req.params.id,
          shiftId: shiftId,
        }))
      )
      if (response.length === 0) return res.sendStatus(404)
      return res.send({ response: response })
    } catch (error) {
      return res.status(400).send({ error: error })
    }
  })

  // Delete Shifts from Schedule
  router.delete("/:id/shift", roles.requireAdmin, async (req, res) => {
    try {
      const shiftIds = req.body.shiftIds.map((val) => {
        return { shiftId: val }
      })
      const response = await models.ScheduleShift.destroy({
        where: {
          [sequelize.Op.and]: [
            { scheduleId: req.params.id },
            {
              [sequelize.Op.or]: [...shiftIds],
            },
          ],
        },
      })
      if (response === undefined)
        return res.status(404).send({ message: "Not found" })
      return res.status(200).send({ message: "Deleted successfully" })
    } catch (error) {
      res.status(400).send({ error: error })
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
    try {
      if (count > 0) throw new Error("Delete works before creating new")
    } catch (error) {
      res.send({ error: error.message })
      return
    }
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
      res.send({
        schedule: req.schedule,
        works: req.works,
      })
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
    await models.WorkEmployee.bulkCreate(workEmployees)
    next()
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
      res.send({
        schedule: req.schedule,
        employees: req.employees,
        works: req.works,
      })
    }
  )

  return router
}
