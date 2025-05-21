module.exports = (models) => {
  const router = require("express").Router()
  const roles = require("./../roles.js")

  const requireAdmin = (req, res, next) => {
    if (!roles.isAdmin(req.user.role)) return res.sendStatus(403)
    next()
  }

  // Get all
  router.get("/", requireAdmin, async (req, res) => {
    const employees = await models.Employee.findAll()
    return res.send({ employees: employees })
  })

  // Get one
  router.get("/:id", async (req, res) => {
    if (
      !roles.isAdmin(req.user.role) &&
      !(Math.floor(req.user.id) === Math.floor(req.params.id))
    )
      return res.sendStatus(403)
    const employee = await models.Employee.findByPk(req.params.id)
    if (employee === null) return res.sendStatus(404)
    return res.send({ employee: employee })
  })

  // Create one
  router.post("/", requireAdmin, async (req, res) => {
    try {
      const response = await models.Employee.create({ ...req.body })
      return res.send({ response: response })
    } catch (error) {
      return res.status(400).send({ error: error.message })
    }
  })

  // Update one
  router.put("/:id", requireAdmin, async (req, res) => {
    try {
      const response = await models.Employee.update(
        { ...req.body },
        {
          where: { id: req.params.id },
        }
      )
      if (response[0] === 0) return res.sendStatus(404)
      return res.status(200).send({ message: "Updated successfully" })
    } catch (error) {
      return res.status(400).send({ error: error.message })
    }
  })

  // Delete one
  router.delete("/:id", requireAdmin, async (req, res) => {
    try {
      const response = await models.Employee.destroy({
        where: { id: req.params.id },
      })
      if (response === 0) return res.status(404).send({ message: "Not found" })
      return res.status(200).send({ message: "Deleted successfully" })
    } catch (error) {
      return res.status(400).send({ error: error.message })
    }
  })

  return router
}
