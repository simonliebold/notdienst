module.exports = (models) => {
  const { Op } = require("sequelize")
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
  router.get("/:initials", roles.requireAdmin, async (req, res) => {
    const employee = await models.Employee.findOne({
      where: { initials: req.params.initials },
      include: [
        models.Employment,
        models.Job,
        models.Schedule,
        {
          model: models.Work,
          where: { end: { [Op.gt]: new Date() } },
          required: false,
          include: [models.Event, models.Schedule],
        },
      ],
    })

    if (employee === null)
      return res
        .status(404)
        .send({ error: "Mitarbeiter konnte nicht gefunden werden." })
    return res.send({ employee: employee })
  })

  // Create one
  router.post("/", roles.requireAdmin, async (req, res) => {
    try {
      const response = await models.Employee.create({
        name: req.body.name,
        initials: req.body.initials,
      })
      return res.send({ response: response })
    } catch (error) {
      return res.status(400).send({ error: error.message })
    }
  })

  // Update one
  router.put("/:initials", roles.requireAdmin, async (req, res) => {
    try {
      const employee = await models.Employee.findOne({
        where: { initials: req.params.initials },
      })

      if (!employee)
        return res
          .status(400)
          .send({ error: "Es wurden keine Änderungen vorgenommen" })

      await models.Employee.update(
        {
          initials: req.body.initials.toUpperCase(),
          name: req.body.name,
          employmentId: req.body.employmentId,
        },
        {
          where: { initials: req.params.initials },
        }
      )

      if (req.body.jobs) {
        await models.JobEmployee.destroy({
          where: { employeeId: employee.id },
        })
        await models.JobEmployee.bulkCreate(
          req.body.jobs.map((jobId) => {
            return { jobId: jobId, employeeId: employee.id }
          })
        )
      }
      return res.status(200).send({ message: "Änderungen gespeichert" })
    } catch (error) {
      if (error.message && error.message === "Validation error")
        return res
          .status(400)
          .send({ error: "Das Kürzel des Mitarbeiters existiert bereits" })
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
