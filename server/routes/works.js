const { default: mongoose } = require("mongoose")
const Work = require("../schemas/Work")

module.exports = () => {
  const router = require("express").Router()
  const roles = require("../roles")

  // Get all
  router.get("/", roles.requireAdmin, async (req, res, next) => {
    try {
      const works = await Work.find({})
      if (!works) return next(new Error("Nicht gefunden"))
      return res.send(works)
    } catch (err) {
      return next(err)
    }
  })

  // Get one
  router.get("/:id", roles.requireAdmin, async (req, res, next) => {
    try {
      const work = await Work.aggregate([
        { $match: { _id: new mongoose.Types.ObjectId(req.params.id) } },
        {
          $lookup: {
            from: "employees",
            localField: "employeeIds",
            foreignField: "_id",
            as: "employees",
          },
        },
        {
          $lookup: {
            from: "shifts",
            localField: "shiftId",
            foreignField: "_id",
            as: "shift",
          },
        },
        {
          $lookup: {
            from: "jobs",
            localField: "shift.jobIds",
            foreignField: "_id",
            as: "jobs",
          },
        },
        {
          $lookup: {
            from: "schedules",
            localField: "scheduleId",
            foreignField: "_id",
            as: "schedule",
          },
        },
        { $unwind: { path: "$shift", preserveNullAndEmptyArrays: true } },
        { $unwind: { path: "$schedule", preserveNullAndEmptyArrays: true } },
      ])
      if (!work) return next(new Error("Nicht gefunden"))
      return res.send(work[0])
    } catch (err) {
      return next(err)
    }
  })

  // Create one
  router.post("/", roles.requireAdmin, async (req, res, next) => {
    try {
      const { short, title, start, end, shiftId, scheduleId, employeeIds } =
        req?.body || {}
      const work = new Work({
        short,
        title,
        start,
        end,
        shiftId,
        scheduleId,
        employeeIds,
      })

      await work.save()

      return res.send(work)
    } catch (err) {
      return next(err)
    }
  })

  // Update one
  router.put("/:id", roles.requireAdmin, async (req, res, next) => {
    try {
      const { short, title, start, end, shiftId, scheduleId, employeeIds } =
        req?.body || {}
      await Work.findByIdAndUpdate(req.params.id, {
        short,
        title,
        start,
        end,
        shiftId,
        scheduleId,
        employeeIds,
      })

      return res.send({ message: "Erfolgreich aktualisiert" })
    } catch (err) {
      return next(err)
    }
  })

  // Delete one
  router.delete("/:id", roles.requireAdmin, async (req, res, next) => {
    try {
      await Work.findByIdAndDelete(req.params.id)
      return res.send({ message: "Endgültig gelöscht" })
    } catch (err) {
      return next(err)
    }
  })

  return router
}
