const Employment = require("../schemas/Employment")

module.exports = () => {
  const router = require("express").Router()
  const roles = require("../roles")

  // Get all
  router.get("/", roles.requireAdmin, async (req, res, next) => {
    try {
      const employments = await Employment.find({})
      if (!employments) return next(new Error("Nicht gefunden"))
      return res.send(employments)
    } catch (err) {
      return next(err)
    }
  })

  // Get one
  router.get("/:id", roles.requireAdmin, async (req, res, next) => {
    try {
      const employment = await Employment.findById(req.params.id)
      if (!employment) return next(new Error("Nicht gefunden"))
      return res.send(employment)
    } catch (err) {
      return next(err)
    }
  })

  // Create one
  router.post("/", roles.requireAdmin, async (req, res, next) => {
    try {
      const { short, title, maxHours, minHours } = req?.body || {}
      const employee = new Employment({
        short,
        title,
        maxHours,
        minHours,
      })

      await employee.save()

      return res.send(employee)
    } catch (err) {
      return next(err)
    }
  })

  // Update one
  router.put("/:id", roles.requireAdmin, async (req, res, next) => {
    try {
      const { short, title, maxHours, minHours } = req?.body || {}
      await Employment.findByIdAndUpdate(req.params.id, {
        short,
        title,
        maxHours,
        minHours,
      })

      return res.send({ message: "Erfolgreich aktualisiert" })
    } catch (err) {
      return next(err)
    }
  })

  // Delete one
  router.delete("/:id", roles.requireAdmin, async (req, res, next) => {
    try {
      await Employment.findByIdAndDelete(req.params.id)
      return res.send({ message: "Endgültig gelöscht" })
    } catch (err) {
      return next(err)
    }
  })

  return router
}
