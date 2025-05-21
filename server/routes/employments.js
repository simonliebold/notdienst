const Employment = require("../schemas/Employment")

module.exports = () => {
  const router = require("express").Router()
  const roles = require("../roles")

  // Get all
  router.get("/", roles.requireAdmin, async (req, res, next) => {
    const employments = await Employment.find({}).catch(next)
    if (!employments) return next(new Error("Nicht gefunden"))
    return res.send(employments)
  })

  // Get one
  router.get("/:id", roles.requireAdmin, async (req, res, next) => {
    const employment = await Employment.findById(req.params.id).catch(next)
    if (!employment) return next(new Error("Nicht gefunden"))
    return res.send(employment)
  })

  // Create one
  router.post("/", roles.requireAdmin, async (req, res, next) => {
    const { short, title, maxHours, minHours } = req?.body || {}
    const employee = new Employee({
      short,
      title,
      maxHours,
      minHours,
    })

    await employee.save().catch(next)

    return res.send(employee)
  })

  // Update one
  router.put("/:id", roles.requireAdmin, async (req, res, next) => {
    const { short, title, maxHours, minHours } = req?.body || {}
    await Employment.findByIdAndUpdate(req.params.id, {
      short,
      title,
      maxHours,
      minHours,
    }).catch(next)

    return res.send({ message: "Erfolgreich aktualisiert" })
  })

  // Delete one
  router.delete("/:id", roles.requireAdmin, async (req, res, next) => {
    await Employment.findByIdAndDelete(req.params.id).catch(next)
    return res.send({ message: "Endgültig gelöscht" })
  })

  return router
}
