const { Op } = require("sequelize")
module.exports = (models) => {
  const router = require("express").Router()

  // Get all
  router.get("/", async (req, res) => {
    const response = await models.Schedule.findAll()
    res.send({ response: response })
  })

  // Get one
  router.get("/:id", async (req, res) => {
    const response = await models.Schedule.findByPk(req.params.id)
    if (response === null) res.status(404).send({ message: "Not found" })
    else res.send({ response: response })
  })

  // Create one
  router.post("/", async (req, res) => {
    try {
      const response = await models.Schedule.create({ ...req.body })
      res.send({ response: response })
    } catch (error) {
      res.status(400).send({ error: error })
    }
  })

  // Update one
  router.put("/:id", async (req, res) => {
    try {
      const response = await models.Schedule.update(
        { ...req.body },
        {
          where: { id: req.params.id },
        }
      )
      response[0] > 0
        ? res
            .status(200)
            .send({ message: "Updated successfully", rows: response[0] })
        : res.status(404).send({ message: "Not found", rows: response[0] })
    } catch (error) {
      res.status(400).send({ error: error })
    }
  })

  // Delete one
  router.delete("/:id", async (req, res) => {
    try {
      const response = await models.Schedule.destroy({
        where: { id: req.params.id },
      })
      response > 0
        ? res.status(200).send({ message: "Deleted successfully" })
        : res.status(404).send({ message: "Not found" })
    } catch (error) {
      res.status(400).send({ error: error })
    }
  })

  // Get all employees
  router.get("/:id/employee", async (req, res) => {
    const response = await models.ScheduleEmployee.findAll({
      where: { scheduleId: req.params.id },
    })
    res.send({ response: response })
  })

  // Add Employees to Job
  router.post("/:id/employee", async (req, res) => {
    try {
      const response = await models.ScheduleEmployee.bulkCreate(
        req.body.employeeIds.map((employeeId) => ({
          scheduleId: req.params.id,
          employeeId: employeeId,
        }))
      )
      res.send({ response: response })
    } catch (error) {
      res.status(400).send({ error: error })
    }
  })

  // Delete Employees from Job
  router.delete("/:id/employee", async (req, res) => {
    try {
      const employeeIds = req.body.employeeIds.map((val) => {
        return { employeeId: val }
      })
      const response = await models.ScheduleEmployee.destroy({
        where: {
          [Op.and]: [
            { scheduleId: req.params.id },
            {
              [Op.or]: [...employeeIds],
            },
          ],
        },
      })
      response > 0
        ? res.status(200).send({ message: "Deleted successfully" })
        : res.status(404).send({ message: "Not found" })
    } catch (error) {
      res.status(400).send({ error: error })
    }
  })

  // Get all shifts
  router.get("/:id/shift", async (req, res) => {
    const response = await models.ScheduleShift.findAll({
      where: { scheduleId: req.params.id },
    })
    res.send({ response: response })
  })

  // Add Shifts to Job
  router.post("/:id/shift", async (req, res) => {
    try {
      const response = await models.ScheduleShift.bulkCreate(
        req.body.shiftIds.map((shiftId) => ({
          scheduleId: req.params.id,
          shiftId: shiftId,
        }))
      )
      res.send({ response: response })
    } catch (error) {
      res.status(400).send({ error: error })
    }
  })

  // Delete Shifts from Job
  router.delete("/:id/shift", async (req, res) => {
    try {
      const shiftIds = req.body.shiftIds.map((val) => {
        return { shiftId: val }
      })
      const response = await models.ScheduleShift.destroy({
        where: {
          [Op.and]: [
            { scheduleId: req.params.id },
            {
              [Op.or]: [...shiftIds],
            },
          ],
        },
      })
      response > 0
        ? res.status(200).send({ message: "Deleted successfully" })
        : res.status(404).send({ message: "Not found" })
    } catch (error) {
      res.status(400).send({ error: error })
    }
  })

  const getSchedule = async (req, res, next) => {
    const schedule = await models.Schedule.findByPk(req.params.id)
    if (schedule === null) res.status(404).send({ message: "Not found" })
    req.schedule = schedule
    next()
  }

  // Get employees
  const getEmployees = async (req, res, next) => {
    const schedule = await models.Schedule.findByPk(req.params.id, {
      include: {
        model: models.Employee,
        through: { attributes: [] },
        include: models.Employment,
      },
    })
    if (schedule === null)
      res.status(404).send({ message: "No employees found" })
    const employees = schedule.dataValues.employees
    req.employees = {}
    employees.forEach((e) => {
      req.employees[e.id] = {
        id: e.id,
        initials: e.initials,
        minHours: e.employment.minHours,
        maxHours: e.employment.maxHours,
        possibleHours: 0,
        workHours: 0,
      }
    })

    next()
  }

  // Get freetimes
  const getFreetimes = async (req, res, next) => {
    for (const employeeId in req.employees) {
      req.employees[employeeId].freetimes = await models.Freetime.findAll({
        where: { scheduleId: req.schedule.id, employeeId: employeeId },
      })
    }
    next()
  }

  // Get events
  const getEvents = async (req, res, next) => {
    const events = await models.Event.findAll({
      include: [
        {
          model: models.Shift,
          include: [
            {
              model: models.Job,
              through: { attributes: [] },
              include: {
                model: models.Employee,
                through: { attributes: [] },
              },
            },
          ],
        },
      ],
    })
    if (events === null) res.status(404).send({ message: "No events found" })

    req.events = events.map((event) => event.dataValues)
    for (const i in req.events) {
      const employeeIds = {}
      for (const j in req.events[i].shift.jobs) {
        for (const k in req.events[i].shift.jobs[j].employees) {
          const id = req.events[i].shift.jobs[j].employees[k].id
          employeeIds[id] = id
        }
      }
      req.events[i].employeeIds = Object.keys(employeeIds).map((val) =>
        Math.floor(val)
      )
    }
    req.events = req.events.map((event) => {
      return {
        id: event.id,
        title: event.title,
        requiredEmployees: event.requiredEmployees,
        timeStart: event.timeStart,
        timeEnd: event.timeEnd,
        repeatWeekday: event.repeatWeekday,
        employeeIds: event.employeeIds,
        shiftId: event.shiftId,
      }
    })

    next()
  }

  // Get works
  const getWorks = async (req, res, next) => {
    let works = []
    const first = new Date(req.schedule.start)
    const last = new Date(req.schedule.end)
    req.events.forEach(async (event) => {
      const timeStart = event.timeStart.split(":")
      const timeEnd = event.timeEnd.split(":")
      for (let i = new Date(first); i <= last; i.setDate(i.getDate() + 1)) {
        if (i.getDay() !== event.repeatWeekday) continue
        const start = new Date(i)
        start.setHours(timeStart[0], timeStart[1], timeStart[2])

        const end = new Date(i)
        if (timeStart[0] > timeEnd[0]) end.setDate(end.getDate() + 1)
        end.setHours(timeEnd[0], timeEnd[1], timeEnd[2])

        works.push({
          start: start,
          end: end,
          scheduleId: req.schedule.id,
          eventId: event.id,
        })
      }
    })
    req.works = await models.Work.bulkCreate(works)
    next()
  }

  router.post(
    "/:id/plan",
    getSchedule,
    getEmployees,
    getFreetimes,
    getEvents,
    getWorks,
    async (req, res) => {
      res.send({
        schedule: req.schedule,
        employees: req.employees,
        events: req.events,
        works: req.works,
      })
    }
  )

  return router
}
