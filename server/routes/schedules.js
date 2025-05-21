const { Op } = require("sequelize")
const { RRule, datetime } = require("rrule")

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
    const schedule = await models.Schedule.findByPk(req.params.id, {
      include: [models.Shift],
    })
    if (!schedule)
      return res.status(404).send({ error: "Dienstplan konnte nicht gefunden" })

    req.schedule = {
      id: schedule?.id,
      short: schedule?.short,
      title: schedule?.title,
      deadline: new Date(schedule?.deadline),
      start: new Date(schedule?.start),
      end: new Date(schedule?.end),
      shifts: schedule?.shifts,
      shiftIds: schedule?.shifts?.map((shift) => shift.id),
    }
    next()
  }

  const getRrules = async (req, res, next) => {
    const rrules = await models.Rrule.findAll({
      include: {
        model: models.Shift,
        where: { id: { [Op.in]: req.schedule.shiftIds } },
      },
    })
    if (rrules.length === 0)
      return res
        .status(400)
        .send({ error: "Es müssen aktive Schichten verknüpft werden." })
    req.rrules = rrules
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

    // TODO: fix daylight saving error
    req.rrules.forEach((rrule) => {
      let ruleStart = new Date(req.schedule.start.getTime())
      ruleStart.setHours(...rrule.start.split(":"))

      let ruleEnd = new Date(req.schedule.end.getTime())
      ruleEnd.setHours(23, 59, 59)

      let options = RRule.parseString(rrule?.content)
      options.dtstart = new Date(ruleStart.getTime())
      options.until = new Date(ruleEnd.getTime())
      const dates = new RRule(options).all()

      dates.forEach((start) => {
        let end = new Date(start.getTime())
        end.setHours(...rrule.end.split(":"))

        if (end < start) end.setDate(end.getDate() + 1)

        works.push({
          start: start,
          end: end,
          rruleId: rrule.id,
          scheduleId: req.schedule.id,
        })
      })
    })

    req.works = await models.Work.bulkCreate(works)

    next()
  }

  // Create works
  router.post(
    "/:id/create",
    roles.requireAdmin,
    getSchedule,
    getRrules,
    createWorks,
    async (req, res) => {
      return res.send(req.works)
    }
  )

  // Get works
  const getWorks = async (req, res, next) => {
    const works = await models.Work.findAll({
      where: { scheduleId: req.schedule.id },
    })

    if (works.length === 0)
      return res
        .status(400)
        .send({ error: "Es wurden noch keine Dienste generiert." })

    req.works = works
    next()
  }

  // Get employees
  const getEmployees = async (req, res, next) => {
    const employees = await models.Employee.findAll({
      include: [
        { model: models.Schedule, where: { id: req.params.id } },
        models.Employment,
      ],
    })

    req.employees = {}
    const employeeIds = []

    employees.forEach((employee) => {
      req.employees[employee.id] = {
        ...employee.dataValues,
        freetimes: [],
        minHours: employee.employment.minHours,
        maxHours: employee.employment.maxHours,
        possibleHours: 0,
        workHours: 0,
      }
      employeeIds.push(employee.id)
    })

    // Get freetimes
    const freetimes = await models.Freetime.findAll({
      where: {
        [Op.and]: [
          { employeeId: { [Op.in]: employeeIds } },
          { date: { [Op.between]: [req.schedule.start, req.schedule.end] } },
        ],
      },
    })

    freetimes?.forEach((freetime) => {
      req.employees[freetime.employeeId].freetimes.push(freetime.dataValues)
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
    getWorks,
    getEmployees,
    // checkAvailability,
    // orderWorks,
    // allocateWorks,
    async (req, res) => {
      return res.send(req.employees)
    }
  )

  return router
}
