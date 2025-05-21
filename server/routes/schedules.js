const { default: mongoose } = require("mongoose")
const Schedule = require("../schemas/Schedule")

module.exports = () => {
  const router = require("express").Router()
  const roles = require("../roles")

  // Get all
  router.get("/", roles.requireAdmin, async (req, res, next) => {
    const schedules = await Schedule.find({}).catch(next)
    if (!schedules) return next(new Error("Nicht gefunden"))
    return res.send(schedules)
  })

  // Get one
  router.get("/:id", roles.requireAdmin, async (req, res, next) => {
    const schedule = await Schedule.aggregate([
      { $match: { _id: new mongoose.Types.ObjectId(req.params.id) } },
    ]).catch(next)
    if (!schedule) return next(new Error("Nicht gefunden"))
    return res.send(schedule[0])
  })

  // Create one
  router.post("/", roles.requireAdmin, async (req, res, next) => {
    const { short, title, employmentId, jobIds } = req?.body || {}
    const schedule = new Schedule({
      short,
      title,
    })

    await schedule.save().catch(next)

    return res.send(schedule)
  })

  // Update one
  router.put("/:id", roles.requireAdmin, async (req, res, next) => {
    const { short, title, employmentId, jobIds } = req?.body || {}
    await Schedule.findByIdAndUpdate(req.params.id, {
      short,
      title,
    }).catch(next)

    return res.send({ message: "Erfolgreich aktualisiert" })
  })

  // Delete one
  router.delete("/:id", roles.requireAdmin, async (req, res, next) => {
    await Schedule.findByIdAndDelete(req.params.id).catch(next)
    return res.send({ message: "Endgültig gelöscht" })
  })

  return router
}
