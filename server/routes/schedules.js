const mongoose = require("mongoose")
const Schedule = require("../models/Schedule")
const router = require("express").Router()
const { RRule } = require("rrule")
const roles = require("../roles")
const Rrule = require("../models/Rrule")
const Work = require("../models/Work")
const Employee = require("../models/Employee")
const variables = require("./../variables")
const { spawn } = require("child_process")

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
    const schedule = await Schedule.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(req.params.id),
        },
      },
      {
        $lookup: {
          from: "works",
          localField: "_id",
          foreignField: "scheduleId",
          as: "works",
        },
      },
      {
        $unwind: {
          path: "$works",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: "employees",
          localField: "works.employeeIds",
          foreignField: "_id",
          as: "works.employees",
        },
      },
      {
        $group: {
          _id: "$_id",
          short: {
            $first: "$short",
          },
          title: {
            $first: "$title",
          },
          start: {
            $first: "$start",
          },
          end: {
            $first: "$end",
          },
          works: {
            $push: {
              $cond: {
                if: { $gt: [{ $ifNull: ["$works._id", null] }, null] },
                then: "$works",
                else: "$$REMOVE",
              },
            },
          },
        },
      },
    ])

    return res.send(schedule[0])
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

  const works = rrules.flatMap((rrule) => {
    const ruleStart = new Date(schedule.start)
    ruleStart.setHours(...rrule.start.split(":"))

    const ruleEnd = new Date(schedule.end)
    ruleEnd.setHours(23, 59, 59)

    const options = {
      ...RRule.parseString(rrule.content),
      dtstart: ruleStart,
      until: ruleEnd,
    }

    return new RRule(options).all().map((start) => {
      const end = new Date(start)
      end.setHours(...rrule.end.split(":"))
      if (end < start) end.setDate(end.getDate() + 1)

      return {
        title: `${rrule.title} am ${start.toLocaleDateString("de-DE")}`,
        short: rrule.short,
        start,
        end,
        shiftId: rrule.shiftId,
        scheduleId: schedule._id,
      }
    })
  })

  works.sort((a, b) => a.start - b.start)
  return works
}

// Create works
router.post("/:id/create", roles.requireAdmin, async (req, res, next) => {
  try {
    const schedule = await getSchedule(req.params.id)
    const works = await createWorks(schedule)
    await Work.insertMany(works)
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
      // console.log(work.title, employee.short, "isFree " + isFree)
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
const allocateWorks = async (works, employees, scheduleId) => {
  let workEmployees = []
  const protocol = []
  while (works.length > 0) {
    let bestEmployee
    let bestEmployeeRemainingHours
    const work = works[0]
    const duration =
      (work.end.getTime() - work.start.getTime()) / (1000 * 60 * 60)
    work.employeeIds.forEach((employeeId) => {
      const employee = employees.find(
        (employee) => employee._id.toString() === employeeId.toString()
      )

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
        work: work.title,
        employee: employee.short,
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
      await Work.deleteMany({ scheduleId: scheduleId })
      throw new Error(
        "Es stehen zu wenig Mitarbeiter für die Anzahl an Diensten zur Verfügung."
      )
    }
    workEmployees.push({
      workId: work._id,
      employeeId: bestEmployee._id,
    })

    // await Work.updateOne({ _id: work._id }, { employeeIds: [bestEmployee._id] })

    bestEmployee.freetimes.push({
      start: new Date(
        work.start.getTime() - variables.WORK_PUFFER * 60 * 60 * 1000
      ),
      end: new Date(
        work.end.getTime() + variables.WORK_PUFFER * 60 * 60 * 1000
      ),
      work: work._id,
    })
    bestEmployee.workTime += duration
    works.shift()
  }

  const bulkUpdateOperations = workEmployees.map(({ workId, employeeId }) => ({
    updateOne: {
      filter: { _id: workId },
      update: { $addToSet: { employeeIds: employeeId } },
    },
  }))

  await Work.bulkWrite(bulkUpdateOperations)
  return protocol
}

const allocate = async (schedule) => {
  const works = await getWorks(schedule?._id)
  const employees = await getEmployees(schedule)
  await sortWorks(works, employees)
  const protocol = await allocateWorks(works, employees, schedule?._id)
  return { protocol, employees }
  // return employees
}

router.post("/:id/allocate", roles.requireAdmin, async (req, res, next) => {
  try {
    const schedule = await getSchedule(req.params.id)
    const works = await getWorks(schedule?._id)
    const employees = await getEmployees(schedule)

    const inputData = JSON.stringify({ works, employees })

    const pythonProcess = spawn("python3", ["python/solver.py"])

    pythonProcess.stdin.write(inputData)
    pythonProcess.stdin.end()

    let pythonOutput = ""
    let jsonStarted = false

    pythonProcess.stdout.on("data", (data) => {
      const output = data.toString()

      if (jsonStarted) {
        pythonOutput += output
      } else if (output.includes("START_JSON_OUTPUT")) {
        jsonStarted = true
        pythonOutput += output.split("START_JSON_OUTPUT")[1]
      }
    })

    pythonProcess.on("close", async (code) => {
      if (code !== 0) {
        return next(new Error("Python script failed with code " + code))
      }

      try {
        const result = JSON.parse(pythonOutput.trim())

        const bulkUpdateOperations = result.map(({ employeeId, workId }) => ({
          updateOne: {
            filter: { _id: workId },
            update: { $addToSet: { employeeIds: employeeId } },
          },
        }))

        await Work.bulkWrite(bulkUpdateOperations)

        return res.send({
          message: "Dienste erfolgreich verteilt",
          result,
        })
      } catch (err) {
        return next(new Error("Failed to parse Python output: " + err.message))
      }
    })

    pythonProcess.stderr.on("data", (data) => {
      console.error("Python error:", data.toString())
    })
  } catch (err) {
    return next(err)
  }
})

router.delete("/:id/works", roles.requireAdmin, async (req, res, next) => {
  try {
    const schedule = await getSchedule(req.params.id)
    const condition = schedule?.works.length == 0
    if (condition) {
      throw new Error("Dieser Dienstplan besitzt keine Dienste")
    }

    await Work.deleteMany({
      scheduleId: new mongoose.Types.ObjectId(req.params.id),
    })

    res.send({ message: "Dienste erfolgreich gelöscht" })
  } catch (err) {
    return next(err)
  }
})

module.exports = router
