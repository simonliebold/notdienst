const { default: mongoose } = require("mongoose")
const Freetime = require("../schemas/Freetime")

module.exports = () => {
  const router = require("express").Router()
  const roles = require("../roles")

  // Get all
  router.get("/", roles.requireAdmin, async (req, res, next) => {
    const freetimes = await Freetime.find({}).catch(next)
    if (!freetimes) return next(new Error("Nicht gefunden"))
    return res.send(freetimes)
  })

  // Get one
  router.get("/:id", roles.requireAdmin, async (req, res, next) => {
    const freetime = await Freetime.aggregate([
      { $match: { _id: new mongoose.Types.ObjectId(req.params.id) } },
      {
        $lookup: {
          from: "employees",
          localField: "employeeId",
          foreignField: "_id",
          as: "employee",
        },
      },
      { $unwind: "$employee" },
    ]).catch(next)
    if (!freetime) return next(new Error("Nicht gefunden"))
    return res.send(freetime[0])
  })

  // Create one
  router.post("/", roles.requireAdmin, async (req, res, next) => {
    const { short, title, employmentId, jobIds } = req?.body || {}
    const freetime = new Freetime({
      short,
      title,
    })

    await freetime.save().catch(next)

    return res.send(freetime)
  })

  // Update one
  router.put("/:id", roles.requireAdmin, async (req, res, next) => {
    const { short, title, employmentId, jobIds } = req?.body || {}
    await Freetime.findByIdAndUpdate(req.params.id, {
      short,
      title,
    }).catch(next)

    return res.send({ message: "Erfolgreich aktualisiert" })
  })

  // Delete one
  router.delete("/:id", roles.requireAdmin, async (req, res, next) => {
    await Freetime.findByIdAndDelete(req.params.id).catch(next)
    return res.send({ message: "Endgültig gelöscht" })
  })

  return router
}
