const { default: mongoose } = require("mongoose")
const Shift = require("../schemas/Shift")

module.exports = () => {
  const router = require("express").Router()
  const roles = require("../roles")

  // Get all
  router.get("/", roles.requireAdmin, async (req, res, next) => {
    try {
      const shifts = await Shift.find({})
      if (!shifts) return next(new Error("Nicht gefunden"))
      return res.send(shifts)
    } catch (err) {
      return next(err)
    }
  })

  // Get one
  router.get("/:id", roles.requireAdmin, async (req, res, next) => {
    try {
      const shift = await Shift.aggregate([
        { $match: { _id: new mongoose.Types.ObjectId(req.params.id) } },
        {
          $lookup: {
            from: "jobs",
            localField: "jobIds",
            foreignField: "_id",
            as: "jobs",
          },
        },
        {
          $lookup: {
            from: "rrules",
            localField: "_id",
            foreignField: "shiftId",
            as: "rrules",
          },
        },
        { $unwind: { path: "$employment", preserveNullAndEmptyArrays: true } },
      ])
      if (!shift) return next(new Error("Nicht gefunden"))
      return res.send(shift[0])
    } catch (err) {
      return next(err)
    }
  })

  // Create one
  router.post("/", roles.requireAdmin, async (req, res, next) => {
    try {
      const { short, title, jobIds } = req?.body || {}
      const shift = new Shift({
        short,
        title,
        jobIds,
      })

      await shift.save()

      return res.send(shift)
    } catch (err) {
      return next(err)
    }
  })

  // Update one
  router.put("/:id", roles.requireAdmin, async (req, res, next) => {
    try {
      const { short, title, employmentId, jobIds } = req?.body || {}
      await Shift.findByIdAndUpdate(req.params.id, {
        short,
        title,
        jobIds,
      })

      return res.send({ message: "Erfolgreich aktualisiert" })
    } catch (err) {
      return next(err)
    }
  })

  // Delete one
  router.delete("/:id", roles.requireAdmin, async (req, res, next) => {
    try {
      await Shift.findByIdAndDelete(req.params.id)
      return res.send({ message: "Endgültig gelöscht" })
    } catch (err) {
      return next(err)
    }
  })

  return router
}
