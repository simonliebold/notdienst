const mongoose = require("mongoose")
const Schedule = require("../models/Schedule")
const router = require("express").Router()
const { RRule } = require("rrule")
const roles = require("../roles")
const Rrule = require("../models/Rrule")
const Work = require("../models/Work")
const Employee = require("../models/Employee")

const getSchedule = async (id) => {
  const schedules = await Schedule.aggregate([
    { $match: { _id: new mongoose.Types.ObjectId(id) } },
    {
      $lookup: {
        from: "works",
        localField: "_id",
        foreignField: "scheduleId",
        as: "works",
      },
    },
  ])
  if (!schedules || schedules.length === 0) throw new Error("Nicht gefunden")
  return schedules[0]
}

const getEmployees = async (schedule) => {
  const employees = await Employee.aggregate([
    {
      $lookup: {
        from: "freetimes",
        let: { employeeId: "$_id" },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  { $eq: ["$employeeId", "$$employeeId"] },
                  { $lt: ["$start", schedule.end] },
                  { $gt: ["$end", schedule.start] },
                ],
              },
            },
          },
          {
            $project: {
              start: 1,
              end: 1,
            },
          },
        ],
        as: "freetimes",
      },
    },
    {
      $lookup: {
        from: "employments",
        localField: "employmentId",
        foreignField: "_id",
        as: "employment",
      },
    },
    { $unwind: "$employment" },
    {
      $project: {
        short: 1,
        freetimes: "$freetimes",
        jobIds: "$jobIds",
        minHours: "$employment.minHours",
        maxHours: "$employment.maxHours",
      },
    },
    {
      $addFields: {
        availableTime: 0,
        workTime: 0,
      },
    },
  ])

  return employees
}

const getWorks = async (scheduleId) => {
  const works = await Work.aggregate([
    { $match: { scheduleId: new mongoose.Types.ObjectId(scheduleId) } },
    {
      $lookup: {
        from: "shifts",
        localField: "shiftId",
        foreignField: "_id",
        as: "shift",
      },
    },
    { $unwind: "$shift" },
    {
      $lookup: {
        from: "jobs",
        localField: "shift.jobIds",
        foreignField: "_id",
        as: "jobs",
      },
    },
    {
      $project: {
        short: 1,
        title: 1,
        start: 1,
        end: 1,
        jobs: "$jobs",
        jobIds: "$shift.jobIds",
      },
    },
  ])

  if (works.length === 0) return null

  return works
}

// Get all
router.get("/", roles.requireAdmin, async (req, res, next) => {
  try {
    const schedules = await Schedule.find({})
    if (!schedules) return next(new Error("Nicht gefunden"))
    return res.send(schedules)
  } catch (err) {
    return next(err)
  }
})

// Get one
router.get("/:id", roles.requireAdmin, async (req, res, next) => {
  try {
    const schedule = await getSchedule(req.params.id)
    return res.send(schedule)
  } catch (err) {
    return next(err)
  }
})

// Create one
router.post("/", roles.requireAdmin, async (req, res, next) => {
  try {
    const { short, title } = req?.body || {}
    const schedule = new Schedule({
      short,
      title,
    })

    await schedule.save()

    return res.send(schedule)
  } catch (err) {
    return next(err)
  }
})

// Update one
router.put("/:id", roles.requireAdmin, async (req, res, next) => {
  try {
    const { short, title } = req?.body || {}
    await Schedule.findByIdAndUpdate(req.params.id, {
      short,
      title,
    })

    return res.send({ message: "Erfolgreich aktualisiert" })
  } catch (err) {
    return next(err)
  }
})

// Delete one
router.delete("/:id", roles.requireAdmin, async (req, res, next) => {
  try {
    await Schedule.findByIdAndDelete(req.params.id)
    return res.send({ message: "Endgültig gelöscht" })
  } catch (err) {
    return next(err)
  }
})

// create works for schedule
const createWorks = async (schedule) => {
  if (schedule.works.length > 0)
    throw new Error("Es existieren bereits Dienste")

  const rrules = await Rrule.find({})
  if (rrules.length === 0)
    throw new Error("Es existieren noch keine Wiederholungsregeln")

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
        title: rrule.title + " am " + start.toLocaleDateString("de-DE"),
        short: rrule.short,
        start: start,
        end: end,
        shiftId: rrule.shiftId,
        scheduleId: schedule._id,
      })
    })
  })

  works.sort((a, b) => {
    if (a.start.getTime() < b.start.getTime()) return -1
    else if (a.start.getTime() > b.start.getTime()) return 1
    else return 0
  })

  await Work.insertMany(works)

  return works
}

const generateWorks = async (scheduleId) => {
  const schedule = await getSchedule(scheduleId)
  await createWorks(schedule)
}

// Create works
router.post("/:id/create", roles.requireAdmin, async (req, res, next) => {
  try {
    await generateWorks(req.params.id)
  } catch (err) {
    return next(err)
  }
  return res.send({ message: "Erfolg" })
})

// Get employees

// Add employee ids to works
const sortWorks = async (works, employees) => {
  Object.values(works).forEach((work) => {
    work.employeeIds = []
    Object.values(employees).forEach((employee) => {
      const hasJob =
        work.jobIds.find((workJobId) => {
          return (
            employee.jobIds.find((employeeJobId) => {
              return workJobId.toString() === employeeJobId.toString()
            }) !== undefined
          )
        }) !== undefined

      // console.log(
      //   work.short,
      //   employee.short,
      //   "hasJob " + hasJob
      // )
      if (!hasJob) return

      const isFree = employee.freetimes.every(
        (freetime) =>
          new Date(freetime.end).getTime() <= work.start.getTime() ||
          new Date(freetime.start).getTime() >= work.end.getTime()
      )
      console.log(work.title, employee.short, "isFree " + isFree)
      if (isFree) {
        const duration =
          (work.end.getTime() - work.start.getTime()) / (1000 * 60 * 60)
        employee.availableTime += duration
        work.employeeIds.push(employee._id)
      }
    })
  })

  works.sort((a, b) => {
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
        workId: work._id,
        employeeId: employee._id,
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
      await models.Work.destroy({ where: { scheduleId: req.schedule._id } })
      return res.status(400).send({
        error:
          "Es stehen zu wenig Mitarbeiter für die Anzahl an Diensten zur Verfügung.",
        protocol: protocol,
      })
    }
    workEmployees.push({
      workId: work._id,
      employeeId: bestEmployee._id,
    })
    bestEmployee.freetimes.push({
      start: work.start,
      end: work.end,
      work: work._id,
    })
    bestEmployee.workTime += duration
    works.shift()
  }

  return await models.WorkEmployee.bulkCreate(workEmployees)
}

const allocate = async (scheduleId) => {
  const schedule = await getSchedule(scheduleId)
  const works = await getWorks(schedule?._id)
  const employees = await getEmployees(schedule)
  await sortWorks(works, employees)
  return { works, employees }
  // await allocateWorks(sortedWorks, employees)
  // return employees
}

// Allocate works
router.post("/:id/allocate", roles.requireAdmin, async (req, res, next) => {
  try {
    await generateWorks(req.params.id)
    return res.send(await allocate(req.params.id))
  } catch (err) {
    return next(err)
  }
})

module.exports = router
