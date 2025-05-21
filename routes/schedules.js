module.exports = (models, sequelize) => {
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
          [sequelize.Op.and]: [
            { scheduleId: req.params.id },
            {
              [sequelize.Op.or]: [...shiftIds],
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

  // TODO: just safe employee-ids
  const getEvents = async (req, res, next) => {
    const [results, metadata] = await sequelize.query(
      `SELECT shifts.id "shiftId", events.id "eventId", events.title "eventTitle", events.requiredEmployees "eventRequiredEmployees", events.timeStart "eventTimeStart", events.timeEnd "eventTimeEnd", events.repeatWeekday "eventRepeatWeekday", employees.id "employeeId", employees.initials "employeeInitials", employees.name "employeeName", employments.minHours "employeeMinHours", employments.maxHours "employeeMaxHours"
      FROM schedules, schedules_shifts, shifts, events, jobs_shifts, jobs, jobs_employees, employees, employments
      WHERE schedules.id = schedules_shifts.scheduleId
      AND schedules_shifts.shiftId = shifts.id
      AND shifts.id = events.shiftId
      AND jobs_shifts.shiftId = shifts.id
      AND jobs_shifts.jobId = jobs.id
      AND jobs_employees.jobId = jobs.id
      AND jobs_employees.employeeId = employees.id
      AND employees.id NOT IN (SELECT employeeId FROM schedules_employees WHERE scheduleId = schedules.id)
      AND employees.employmentId = employments.id;`
    )

    const events = {}
    results.forEach((result) => {
      const {
        shiftId,
        eventId,
        employeeId,
        eventTitle,
        eventRequiredEmployees,
        eventTimeStart,
        eventTimeEnd,
        eventRepeatWeekday,
      } = result
      if (events[eventId] === undefined)
        events[eventId] = {
          title: eventTitle,
          requiredEmployees: eventRequiredEmployees,
          timeStart: eventTimeStart,
          timeEnd: eventTimeEnd,
          repeatWeekday: eventRepeatWeekday,
          requiredEmployees: eventRequiredEmployees,
          shiftId: shiftId,
          employees: {},
        }
      events[eventId]["employees"][employeeId] = {
        name: result.employeeName,
        initials: result.employeeInitials,
        minHours: result.employeeMinHours,
        maxHours: result.employeeMaxHours,
      }
    })
    req.events = events
    next()
  }

  // Get employees
  const getEmployees = async (req, res, next) => {
    const employees = {}
    for (const [eventId, event] of Object.entries(req.events)) {
      for (const [employeeId, employee] of Object.entries(event["employees"])) {
        employees[employeeId] = {
          id: employeeId,
          ...employee,
          possibleHours: 0,
          workHours: 0,
          freetimes: [],
        }
      }
    }
    req.employees = employees

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

  // Get works
  const getWorks = async (req, res, next) => {
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
    let workEmployees = []
    const first = new Date(req.schedule.start)
    const last = new Date(req.schedule.end)
    for (const [eventId, event] of Object.entries(req.events)) {
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

        let possibleEmployeeIds = []
        for (const [employeeId, employee] of Object.entries(event.employees)) {
          const isFree = req.employees[employeeId].freetimes.every(
            (freetime) =>
              new Date(freetime.end).getTime() <= start.getTime() ||
              new Date(freetime.start).getTime() >= end.getTime()
          )
          if (isFree) {
            req.employees[employeeId].possibleHours += duration
            possibleEmployeeIds.push(employeeId)
            // console.log(start, employeeId, possibleHours)
          }
        }

        workEmployees.push(possibleEmployeeIds)

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
    req.works = req.works.map((elem, ind) => {
      return { ...elem.dataValues, employeeIds: workEmployees[ind] }
    })
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

  // Order employees by possibleHours
  const orderEmployees = (req, res, next) => {
    // req.employees = Object.values(req.employees)
    // req.employees.sort((a, b) => {
    //   if (a.possibleHours < b.possibleHours) return -1
    //   else if (a.possibleHours > b.possibleHours) return 1
    //   else return 0
    // })
    next()
  }

  // TODO: check event requiredEmployees
  // Find employees for work
  const matchWorkEmployees = async (req, res, next) => {
    while (req.works.length > 0) {
      // for (let i = 0; i < 10; i++) console.log("###")
      let firstIteration = true
      let bestEmployee
      let bestEmployeeRatio

      req.works[0].employeeIds.forEach((employeeId) => {
        const employee = req.employees[employeeId]
        employee.possibleHours -= req.works[0].duration
        const employeeRatio = employee.minHours - employee.workHours
        // (employee.minHours - employee.workHours) / employee.possibleHours

        if (
          firstIteration ||
          (employeeRatio > bestEmployeeRatio &&
            employee.workHours + req.works[0].duration < employee.maxHours)
        ) {
          bestEmployee = employee
          bestEmployeeRatio = employeeRatio
          firstIteration = false
        }
      })
      try {
        await models.WorkEmployee.create({
          workId: req.works[0].id,
          employeeId: bestEmployee.id,
        })
        bestEmployee.workHours += req.works[0].duration
        req.works.shift()
      } catch (error) {
        res.status(400).send({ error: error.message })
        return
      }
    }
    next()
  }

  const showDifference = async (req, res, next) => {
    // for (employeeId in req.employees) {
    //   console.log(
    //     req.employees[employeeId].name,
    //     req.employees[employeeId].workHours - req.employees[employeeId].minHours,
    //     req.employees[employeeId].maxHours - req.employees[employeeId].workHours
    //   )
    // }
    next()
  }
  // TODO: order employees by (minHours - workHours) / possibleHours = (remaining hours / possible hours)
  router.post(
    "/:id/plan",
    getSchedule,
    getEvents,
    getEmployees,
    getFreetimes,
    getWorks,
    orderWorks,
    orderEmployees,
    matchWorkEmployees,
    showDifference,
    async (req, res) => {
      res.send({
        schedule: req.schedule,
        employees: req.employees,
        events: req.events,
        events: req.events,
        works: req.works,
      })
    }
  )

  return router
}
