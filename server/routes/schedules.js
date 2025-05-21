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

      const newWorks =
        req.body?.values?.map((employeeId) => ({
          scheduleId: req.params.id,
          employeeId: employeeId,
        })) || []

      await models.ScheduleEmployee.bulkCreate(newWorks)

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

  // get schedule by id
  const getSchedule = async (id) => {
    const schedule = await models.Schedule.findByPk(id, {
      include: [models.Shift],
    })
    if (!schedule) return null

    return {
      id: schedule?.id,
      short: schedule?.short,
      title: schedule?.title,
      deadline: new Date(schedule?.deadline),
      start: new Date(schedule?.start),
      end: new Date(schedule?.end),
      shifts: schedule?.shifts,
      shiftIds: schedule?.shifts?.map((shift) => shift.id),
    }
  }

  // get rrules by shift id
  const getRrules = async (shiftIds) => {
    const rrules = await models.Rrule.findAll({
      include: {
        model: models.Shift,
        where: { id: { [Op.in]: shiftIds } },
      },
    })
    if (rrules.length === 0) return null
    return rrules
  }

  // create works for schedule by rrules
  const createWorks = async (rrules, schedule) => {
    const { count, rows } = await models.Work.findAndCountAll({
      where: { scheduleId: schedule.id },
    })
    if (count > 0) return null

    let works = []

    // TODO: fix daylight saving error
    rrules.forEach((rrule) => {
      let ruleStart = new Date(schedule.start.getTime())
      ruleStart.setHours(...rrule.start.split(":"))

      let ruleEnd = new Date(schedule.end.getTime())
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
          // title: rrule.short,
          title: rrule.short + " am " + start.toLocaleDateString("de-DE"),
          short: rrule.short,
          start: start,
          end: end,
          rruleId: rrule.id,
          scheduleId: schedule.id,
        })
      })
    })

    works.sort((a, b) => {
      if (a.start.getTime() < b.start.getTime()) return -1
      else if (a.start.getTime() > b.start.getTime()) return 1
      else return 0
    })

    return works
  }

  const generateWorks = async (req, res, next) => {
    const schedule = await getSchedule(req.params.id)

    if (!schedule)
      return res.status(404).send({ error: "Dienstplan konnte nicht gefunden" })

    const rrules = await getRrules(schedule.shiftIds)

    if (!rrules)
      return res
        .status(400)
        .send({ error: "Es müssen aktive Schichten verknüpft werden." })

    const works = await createWorks(rrules, schedule)

    if (!works)
      return res.status(400).send({
        error: "Es existieren bereits Dienste für diesen Schichtplan",
      })

    await models.Work.bulkCreate(works)
    next()
  }

  // Create works
  router.post(
    "/:id/create",
    roles.requireAdmin,
    generateWorks,
    async (req, res) => {
      return res.send({ message: "Erfolg" })
    }
  )

  // Get works
  const getWorks = async (scheduleId) => {
    const works = await models.Work.findAll({
      where: { scheduleId: scheduleId },
      include: {
        model: models.Rrule,
        include: { model: models.Shift, include: models.Job },
      },
    })

    if (works.length === 0) return null

    const newWorks = {}
    works.forEach((work) => {
      newWorks[work.id] = {
        id: work.id,
        start: new Date(work.start),
        end: new Date(work.end),
        jobs: work.rrule.shift.jobs,
        jobIds: work.rrule.shift.jobs.map((job) => job.id),
      }
    })

    return newWorks
  }

  // Get employees
  const getEmployees = async (schedule) => {
    const employees = await models.Employee.findAll({
      include: [
        { model: models.Schedule, where: { id: schedule.id } },
        models.Employment,
        models.Job,
      ],
    })

    const newEmployees = {}
    const employeeIds = []

    employees.forEach((employee) => {
      newEmployees[employee.id] = {
        // ...employee.dataValues,
        id: employee.id,
        freetimes: [],
        jobIds: employee.jobs.map((job) => job.id),
        minHours: employee.employment.minHours,
        maxHours: employee.employment.maxHours,
        availableTime: 0,
        workTime: 0,
      }
      employeeIds.push(employee.id)
    })

    // Get freetimes
    const freetimes = await models.Freetime.findAll({
      where: {
        [Op.and]: [
          { employeeId: { [Op.in]: employeeIds } },
          { start: { [Op.lt]: schedule.end } },
          { end: { [Op.gt]: schedule.start } },
        ],
      },
    })

    freetimes?.forEach((freetime) => {
      newEmployees[freetime.employeeId].freetimes.push(freetime.dataValues)
    })

    return newEmployees
  }

  // Add employee ids to works
  const getSortedWorks = async (works, employees) => {
    let newWorks = []
    Object.values(works).forEach((work) => {
      work.employeeIds = []
      Object.values(employees).forEach((employee) => {
        let hasJob = false
        for (let i = 0; i < work.jobIds.length; i++) {
          for (let j = 0; j < employee.jobIds.length; j++) {
            if (work.jobIds[i] !== employee.jobIds[j]) continue
            hasJob = true
            break
          }
          if (hasJob) break
        }
        if (!hasJob) return

        const isFree = employees[employee.id].freetimes.every(
          (freetime) =>
            new Date(freetime.end).getTime() <= work.start.getTime() ||
            new Date(freetime.start).getTime() >= work.end.getTime()
        )
        if (isFree) {
          const duration =
            (work.end.getTime() - work.start.getTime()) / (1000 * 60 * 60)
          employees[employee.id].availableTime += duration
          work.employeeIds.push(employee.id)
        }
      })
      newWorks.push(work)
    })

    return await newWorks.sort((a, b) => {
      if (a.employeeIds.length < b.employeeIds.length) return -1
      else if (a.employeeIds.length > b.employeeIds.length) return 1
      else return Math.random() < 0.5 ? 1 : -1
    })
  }

  // Find employees for work
  const allocateWorks = async (works, employees) => {
    let workEmployees = []
    while (works.length > 0) {
      const protocol = []
      let bestEmployee
      let bestEmployeeRemainingHours
      const work = works[0]
      const duration =
        (work.end.getTime() - work.start.getTime()) / (1000 * 60 * 60)
      work.employeeIds.forEach((employeeId) => {
        const employee = employees[employeeId]

        employee.availableTime -= duration

        let employeeRemainingHours = employee.maxHours
        if (employee.minHours !== null)
          employeeRemainingHours = employee.minHours - employee.workTime

        const newWorkHours = employee.workTime + duration

        // Unter Max Stunden
        const maxHoursCorrect =
          employee.maxHours === null || newWorkHours <= employee.maxHours

        // Platz zum Minimum
        const isBest =
          bestEmployee === undefined ||
          employeeRemainingHours >= bestEmployeeRemainingHours

        const isFree = employee.freetimes.every(
          (freetime) =>
            new Date(freetime.end).getTime() <= work.start.getTime() ||
            new Date(freetime.start).getTime() >= work.end.getTime()
        )

        // TODO: Generierungsbericht
        protocol.push({
          workId: work.id,
          employeeId: employee.id,
          isFree: isFree,
          isBest: isBest,
          maxHoursCorrect: maxHoursCorrect,
          freetimes: employee.freetimes
            .filter(
              (freetime) =>
                new Date(freetime.end).getTime() > work.start.getTime() &&
                new Date(freetime.start).getTime() < work.end.getTime()
            )
            .map((freetime) => freetime.work || "Wunschfrei"),
        })

        if (maxHoursCorrect && isBest && isFree) {
          bestEmployee = employee
          bestEmployeeRemainingHours = employeeRemainingHours
        }
      })
      if (!bestEmployee) {
        await models.Work.destroy({ where: { scheduleId: req.schedule.id } })
        return res.status(400).send({
          error:
            "Es stehen zu wenig Mitarbeiter für die Anzahl an Diensten zur Verfügung.",
          protocol: protocol,
        })
      }
      workEmployees.push({
        workId: work.id,
        employeeId: bestEmployee.id,
      })
      bestEmployee.freetimes.push({
        start: work.start,
        end: work.end,
        work: work.id,
      })
      bestEmployee.workTime += duration
      works.shift()
    }

    return await models.WorkEmployee.bulkCreate(workEmployees)
  }

  const allocate = async (scheduleId) => {
    const schedule = await getSchedule(scheduleId)
    const works = await getWorks(schedule?.id)
    const employees = await getEmployees(schedule)
    const sortedWorks = await getSortedWorks(works, employees)
    await allocateWorks(sortedWorks, employees)
    return employees
  }

  // Allocate works
  router.post(
    "/:id/allocate",
    roles.requireAdmin,
    generateWorks,
    async (req, res) => {
      return res.send(await allocate(req.params.id))
    }
  )

  return router
}
