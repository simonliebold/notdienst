module.exports = (models) => {
  const router = require("express").Router()
  const roles = require("./../roles")

  // Get all
  router.get("/", roles.requireAdmin, async (req, res) => {
    const employees = await models.Employee.findAll()
    return res.send({ employees: employees })
  })

  // Get self
  router.get("/self", async (req, res) => {
    const employee = await models.Employee.findByPk(req.user.id)
    if (employee === null) return res.sendStatus(404)
    return res.send({ employee: employee })
  })

  // Get one
  router.get("/:id", roles.requireAdmin, async (req, res) => {
    const employee = await models.Employee.findByPk(req.params.id, {
      include: [models.Employment, models.Job, models.Schedule, models.Work],
    })

    if (employee === null) return res.sendStatus(404)
    return res.send({ employee: employee })
  })

  // Create one
  router.post("/", roles.requireAdmin, async (req, res) => {
    try {
      const response = await models.Employee.create({ ...req.body })
      return res.send({ response: response })
    } catch (error) {
      return res.status(400).send({ error: error.message })
    }
  })

  // Update one
  router.put("/:id", roles.requireAdmin, async (req, res) => {
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
  router.delete("/:id", roles.requireAdmin, async (req, res) => {
    try {
      const response = await models.Employee.destroy({
        where: { id: req.params.id },
      })
      if (response === 0) return res.sendStatus(404)
      return res.status(200).send({ message: "Deleted successfully" })
    } catch (error) {
      return res.status(400).send({ error: error.message })
    }
  })

  return router
}
