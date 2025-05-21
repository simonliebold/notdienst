const { default: mongoose } = require("mongoose")
const Shift = require("../schemas/Shift")

module.exports = () => {
  const router = require("express").Router()
  const roles = require("../roles")

  // Get all
  router.get("/", roles.requireAdmin, async (req, res, next) => {
    const shifts = await Shift.find({}).catch(next)
    if (!shifts) return next(new Error("Nicht gefunden"))
    return res.send(shifts)
  })

  // Get one
  router.get("/:id", roles.requireAdmin, async (req, res, next) => {
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
      { $unwind: { path: "$employment", preserveNullAndEmptyArrays: true } },
    ]).catch(next)
    if (!shift) return next(new Error("Nicht gefunden"))
    return res.send(shift[0])
  })

  // Create one
  router.post("/", roles.requireAdmin, async (req, res, next) => {
    const { short, title, employmentId, jobIds } = req?.body || {}
    const shift = new Shift({
      short,
      title,
      jobIds,
    })

    await shift.save().catch(next)

    return res.send(shift)
  })

  // Update one
  router.put("/:id", roles.requireAdmin, async (req, res, next) => {
    const { short, title, employmentId, jobIds } = req?.body || {}
    await Shift.findByIdAndUpdate(req.params.id, {
      short,
      title,
      jobIds,
    }).catch(next)

    return res.send({ message: "Erfolgreich aktualisiert" })
  })

  // Delete one
  router.delete("/:id", roles.requireAdmin, async (req, res, next) => {
    await Shift.findByIdAndDelete(req.params.id).catch(next)
    return res.send({ message: "Endgültig gelöscht" })
  })

  return router
}
