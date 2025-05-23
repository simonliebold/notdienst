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
        employeeIds: 1,
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
        short: `${rrule.short} - ${start.toLocaleDateString("de-DE")}`,
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
  const workEmployees = []
  const protocol = []

  while (works.length > 0) {
    const work = works.shift() // Get the first work
    const duration =
      (work.end.getTime() - work.start.getTime()) / (1000 * 60 * 60)

    let bestEmployee = null
    let bestEmployeeRemainingHours = null

    for (const employeeId of work.employeeIds) {
      const employee = employees.find(
        (emp) => emp._id.toString() === employeeId.toString()
      )
      if (!employee) continue

      const remainingHours =
        employee.minHours !== null
          ? employee.minHours - employee.workTime
          : Infinity

      const newWorkHours = employee.workTime + duration

      const isWithinMaxHours =
        employee.maxHours === null || newWorkHours <= employee.maxHours
      const isBestCandidate =
        bestEmployee === null || remainingHours >= bestEmployeeRemainingHours
      const isFree = employee.freetimes.every(
        (freetime) =>
          new Date(freetime.end).getTime() <= work.start.getTime() ||
          new Date(freetime.start).getTime() >= work.end.getTime()
      )

      protocol.push({
        work: work.title,
        employee: employee.short,
        isFree,
        isBest: isBestCandidate,
        maxHoursCorrect: isWithinMaxHours,
        freetimes: employee.freetimes
          .filter(
            (freetime) =>
              new Date(freetime.end).getTime() > work.start.getTime() &&
              new Date(freetime.start).getTime() < work.end.getTime()
          )
          .map((freetime) => freetime.work || "Wunschfrei"),
      })

      if (isWithinMaxHours && isBestCandidate && isFree) {
        bestEmployee = employee
        bestEmployeeRemainingHours = remainingHours
      }
    }

    if (!bestEmployee) throw new Error("Es kein passender Mitarbeiter gefunden")

    workEmployees.push({ workId: work._id, employeeId: bestEmployee._id })

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

const allocateHeuristic = async (schedule) => {
  const works = await getWorks(schedule?._id)
  const employees = await getEmployees(schedule)
  await sortWorks(works, employees)
  const protocol = await allocateWorks(works, employees, schedule?._id)
  return protocol
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

router.post("/:id/allocate2", roles.requireAdmin, async (req, res, next) => {
  try {
    const schedule = await getSchedule(req.params.id)
    const protocol = await allocateHeuristic(schedule)
    res.send({ protocol: protocol })
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

router.get("/:id/report", roles.requireAdmin, async (req, res, next) => {
  try {
    const schedule = await getSchedule(req.params.id)
    const employees = await getEmployees(schedule)
    const works = await getWorks(schedule._id)

    let totalWorkHoursForMonth = 0
    let totalMinHours = 0
    let totalMaxHours = 0
    let totalWorkHoursAllWorks = 0 // New variable to track total hours of all works

    // Calculate total hours for all works
    totalWorkHoursAllWorks = works.reduce((sum, work) => {
      return (
        sum + (work.end.getTime() - work.start.getTime()) / (1000 * 60 * 60)
      )
    }, 0)

    const employeesReport = employees.map((employee) => {
      const employeeWorks = works.filter((work) =>
        work.employeeIds.some(
          (employeeId) => employeeId.toString() === employee._id.toString()
        )
      )

      // Check if employee is within their min and max hours
      const totalWorkHours = employeeWorks.reduce((sum, work) => {
        return (
          sum + (work.end.getTime() - work.start.getTime()) / (1000 * 60 * 60)
        )
      }, 0)

      totalWorkHoursForMonth += totalWorkHours
      totalMinHours += employee.minHours || 0
      totalMaxHours += employee.maxHours || 0

      const withinHours =
        (employee.minHours === null || totalWorkHours >= employee.minHours) &&
        (employee.maxHours === null || totalWorkHours <= employee.maxHours)

      // Check if all assigned works have at least 12 hours in between
      const sortedWorks = employeeWorks.sort((a, b) => a.start - b.start)
      const has12HourBreaks = sortedWorks.every((work, index) => {
        if (index === 0) return true
        const previousWork = sortedWorks[index - 1]
        return (
          work.start.getTime() - previousWork.end.getTime() >=
          12 * 60 * 60 * 1000
        )
      })

      // Calculate the smallest break between shifts
      const smallestBreak = sortedWorks.reduce((minBreak, work, index) => {
        if (index === 0) return minBreak
        const previousWork = sortedWorks[index - 1]
        const breakDuration =
          (work.start.getTime() - previousWork.end.getTime()) / (1000 * 60 * 60)
        return Math.min(minBreak, breakDuration)
      }, Infinity)

      // Check if freetimes overlap with assigned shifts
      const freetimeOverlaps = employeeWorks.some((work) =>
        employee.freetimes.some(
          (freetime) =>
            new Date(freetime.start).getTime() < work.end.getTime() &&
            new Date(freetime.end).getTime() > work.start.getTime()
        )
      )

      // Check if shifts are overlapping
      const hasOverlappingShifts = sortedWorks.some((work, index) => {
        if (index === 0) return false
        const previousWork = sortedWorks[index - 1]
        return work.start.getTime() < previousWork.end.getTime()
      })

      return {
        employee,
        totalWorkHours,
        withinHours,
        has12HourBreaks,
        smallestBreak: smallestBreak === Infinity ? null : smallestBreak, // Return null if no breaks exist
        freetimeOverlaps,
        hasOverlappingShifts,
      }
    })

    res.send({
      employeesReport,
      totalWorkHoursForMonth,
      totalMinHours,
      totalMaxHours,
      totalWorkHoursAllWorks, // Include the new total hours in the response
    })
  } catch (err) {
    return next(err)
  }
})

module.exports = router
