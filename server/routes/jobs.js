const Job = require("../schemas/Job")

module.exports = () => {
  const router = require("express").Router()
  const roles = require("./../roles")

  // Get all
  router.get("/", roles.requireAdmin, async (req, res, next) => {
    const jobs = await Job.find({}).catch(next)
    if (!jobs) return next(new Error("Nicht gefunden"))
    return res.send(jobs)
  })

  // Get one
  router.get("/:id", roles.requireAdmin, async (req, res, next) => {
    const job = await Job.findById(req.params.id)
      .populate("employees")
      .catch(next)
    if (!job) return next(new Error("Nicht gefunden"))
    return res.send(job)
  })

  // Create one
  router.post("/", roles.requireAdmin, async (req, res, next) => {
    const { short, title, employees } = req?.body || {}
    const job = new Job({
      short,
      title,
      employees,
    })

    await job.save().catch(next)

    return res.send(job)
  })

  // Update one
  router.put("/:id", roles.requireAdmin, async (req, res, next) => {
    const { short, title, employees } = req?.body || {}
    await Job.findByIdAndUpdate(req.params.id, {
      short,
      title,
      employees,
    }).catch(next)

    return res.send({ message: "Erfolgreich aktualisiert" })
  })

  // Delete one
  router.delete("/:id", roles.requireAdmin, async (req, res, next) => {
    await Job.findByIdAndDelete(req.params.id).catch(next)
    return res.send({ message: "Endgültig gelöscht" })
  })

  return router
}
