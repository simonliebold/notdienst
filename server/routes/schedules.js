const mongoose = require("mongoose")
const Schedule = require("../schemas/Schedule")
const router = require("express").Router()
const roles = require("../roles")

const getSchedule = async (req, res, next) => {
  try {
    const schedule = await Schedule.aggregate([
      { $match: { _id: new mongoose.Types.ObjectId(req.params.id) } },
      {
        $lookup: {
          from: "works",
          localField: "_id",
          foreignField: "scheduleId",
          as: "works",
        },
      },
    ])
    if (!schedule) return next(new Error("Nicht gefunden"))
    req.schedule = schedule[0]
    next()
  } catch (err) {
    return next(err)
  }
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
router.get("/:id", roles.requireAdmin, getSchedule, async (req, res, next) => {
  return res.send(req.schedule)
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

// // create works for schedule by rrules
// const createWorks = async (rrules, schedule) => {
//   const { count, rows } = await models.Work.findAndCountAll({
//     where: { scheduleId: schedule.id },
//   })
//   if (count > 0) return null

//   let works = []

//   // TODO: fix daylight saving error
//   rrules.forEach((rrule) => {
//     let ruleStart = new Date(schedule.start.getTime())
//     ruleStart.setHours(...rrule.start.split(":"))

//     let ruleEnd = new Date(schedule.end.getTime())
//     ruleEnd.setHours(23, 59, 59)

//     let options = RRule.parseString(rrule?.content)
//     options.dtstart = new Date(ruleStart.getTime())
//     options.until = new Date(ruleEnd.getTime())
//     const dates = new RRule(options).all()

//     dates.forEach((start) => {
//       let end = new Date(start.getTime())
//       end.setHours(...rrule.end.split(":"))

//       if (end < start) end.setDate(end.getDate() + 1)

//       works.push({
//         // title: rrule.short,
//         title: rrule.short + " am " + start.toLocaleDateString("de-DE"),
//         short: rrule.short,
//         start: start,
//         end: end,
//         rruleId: rrule.id,
//         scheduleId: schedule.id,
//       })
//     })
//   })

//   works.sort((a, b) => {
//     if (a.start.getTime() < b.start.getTime()) return -1
//     else if (a.start.getTime() > b.start.getTime()) return 1
//     else return 0
//   })

//   return works
// }

// const generateWorks = async (req, res, next) => {
//   const schedule = await getSchedule(req.params.id)

//   if (!schedule)
//     return res.status(404).send({ error: "Dienstplan konnte nicht gefunden" })

//   const rrules = await getRrules(schedule.shiftIds)

//   if (!rrules)
//     return res
//       .status(400)
//       .send({ error: "Es müssen aktive Schichten verknüpft werden." })

//   const works = await createWorks(rrules, schedule)

//   if (!works)
//     return res.status(400).send({
//       error: "Es existieren bereits Dienste für diesen Schichtplan",
//     })

//   await models.Work.bulkCreate(works)
//   next()
// }

// // Create works
// router.post(
//   "/:id/create",
//   roles.requireAdmin,
//   generateWorks,
//   async (req, res) => {
//     return res.send({ message: "Erfolg" })
//   }
// )

// // Get works
// const getWorks = async (scheduleId) => {
//   const works = await models.Work.findAll({
//     where: { scheduleId: scheduleId },
//     include: {
//       model: models.Rrule,
//       include: { model: models.Shift, include: models.Job },
//     },
//   })

//   if (works.length === 0) return null

//   const newWorks = {}
//   works.forEach((work) => {
//     newWorks[work.id] = {
//       id: work.id,
//       start: new Date(work.start),
//       end: new Date(work.end),
//       jobs: work.rrule.shift.jobs,
//       jobIds: work.rrule.shift.jobs.map((job) => job.id),
//     }
//   })

//   return newWorks
// }

// // Get employees
// const getEmployees = async (schedule) => {
//   const employees = await models.Employee.findAll({
//     include: [
//       { model: models.Schedule, where: { id: schedule.id } },
//       models.Employment,
//       models.Job,
//     ],
//   })

//   const newEmployees = {}
//   const employeeIds = []

//   employees.forEach((employee) => {
//     newEmployees[employee.id] = {
//       // ...employee.dataValues,
//       id: employee.id,
//       freetimes: [],
//       jobIds: employee.jobs.map((job) => job.id),
//       minHours: employee.employment.minHours,
//       maxHours: employee.employment.maxHours,
//       availableTime: 0,
//       workTime: 0,
//     }
//     employeeIds.push(employee.id)
//   })

//   // Get freetimes
//   const freetimes = await models.Freetime.findAll({
//     where: {
//       [Op.and]: [
//         { employeeId: { [Op.in]: employeeIds } },
//         { start: { [Op.lt]: schedule.end } },
//         { end: { [Op.gt]: schedule.start } },
//       ],
//     },
//   })

//   freetimes?.forEach((freetime) => {
//     newEmployees[freetime.employeeId].freetimes.push(freetime.dataValues)
//   })

//   return newEmployees
// }

// // Add employee ids to works
// const getSortedWorks = async (works, employees) => {
//   let newWorks = []
//   Object.values(works).forEach((work) => {
//     work.employeeIds = []
//     Object.values(employees).forEach((employee) => {
//       let hasJob = false
//       for (let i = 0; i < work.jobIds.length; i++) {
//         for (let j = 0; j < employee.jobIds.length; j++) {
//           if (work.jobIds[i] !== employee.jobIds[j]) continue
//           hasJob = true
//           break
//         }
//         if (hasJob) break
//       }
//       if (!hasJob) return

//       const isFree = employees[employee.id].freetimes.every(
//         (freetime) =>
//           new Date(freetime.end).getTime() <= work.start.getTime() ||
//           new Date(freetime.start).getTime() >= work.end.getTime()
//       )
//       if (isFree) {
//         const duration =
//           (work.end.getTime() - work.start.getTime()) / (1000 * 60 * 60)
//         employees[employee.id].availableTime += duration
//         work.employeeIds.push(employee.id)
//       }
//     })
//     newWorks.push(work)
//   })

//   return await newWorks.sort((a, b) => {
//     if (a.employeeIds.length < b.employeeIds.length) return -1
//     else if (a.employeeIds.length > b.employeeIds.length) return 1
//     else return Math.random() < 0.5 ? 1 : -1
//   })
// }

// // Find employees for work
// const allocateWorks = async (works, employees) => {
//   let workEmployees = []
//   while (works.length > 0) {
//     const protocol = []
//     let bestEmployee
//     let bestEmployeeRemainingHours
//     const work = works[0]
//     const duration =
//       (work.end.getTime() - work.start.getTime()) / (1000 * 60 * 60)
//     work.employeeIds.forEach((employeeId) => {
//       const employee = employees[employeeId]

//       employee.availableTime -= duration

//       let employeeRemainingHours = employee.maxHours
//       if (employee.minHours !== null)
//         employeeRemainingHours = employee.minHours - employee.workTime

//       const newWorkHours = employee.workTime + duration

//       // Unter Max Stunden
//       const maxHoursCorrect =
//         employee.maxHours === null || newWorkHours <= employee.maxHours

//       // Platz zum Minimum
//       const isBest =
//         bestEmployee === undefined ||
//         employeeRemainingHours >= bestEmployeeRemainingHours

//       const isFree = employee.freetimes.every(
//         (freetime) =>
//           new Date(freetime.end).getTime() <= work.start.getTime() ||
//           new Date(freetime.start).getTime() >= work.end.getTime()
//       )

//       // TODO: Generierungsbericht
//       protocol.push({
//         workId: work.id,
//         employeeId: employee.id,
//         isFree: isFree,
//         isBest: isBest,
//         maxHoursCorrect: maxHoursCorrect,
//         freetimes: employee.freetimes
//           .filter(
//             (freetime) =>
//               new Date(freetime.end).getTime() > work.start.getTime() &&
//               new Date(freetime.start).getTime() < work.end.getTime()
//           )
//           .map((freetime) => freetime.work || "Wunschfrei"),
//       })

//       if (maxHoursCorrect && isBest && isFree) {
//         bestEmployee = employee
//         bestEmployeeRemainingHours = employeeRemainingHours
//       }
//     })
//     if (!bestEmployee) {
//       await models.Work.destroy({ where: { scheduleId: req.schedule.id } })
//       return res.status(400).send({
//         error:
//           "Es stehen zu wenig Mitarbeiter für die Anzahl an Diensten zur Verfügung.",
//         protocol: protocol,
//       })
//     }
//     workEmployees.push({
//       workId: work.id,
//       employeeId: bestEmployee.id,
//     })
//     bestEmployee.freetimes.push({
//       start: work.start,
//       end: work.end,
//       work: work.id,
//     })
//     bestEmployee.workTime += duration
//     works.shift()
//   }

//   return await models.WorkEmployee.bulkCreate(workEmployees)
// }

// const allocate = async (scheduleId) => {
//   const schedule = await getSchedule(scheduleId)
//   const works = await getWorks(schedule?.id)
//   const employees = await getEmployees(schedule)
//   const sortedWorks = await getSortedWorks(works, employees)
//   await allocateWorks(sortedWorks, employees)
//   return employees
// }

// // Allocate works
// router.post(
//   "/:id/allocate",
//   roles.requireAdmin,
//   generateWorks,
//   async (req, res) => {
//     return res.send(await allocate(req.params.id))
//   }
// )

module.exports = router
