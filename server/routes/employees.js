module.exports = (models) => {
  const { Op } = require("sequelize")
  const router = require("express").Router()
  const roles = require("./../roles")

  // Get all
  router.get("/", roles.requireAdmin, async (req, res) => {
    const employees = await models.Employee.findAll({
      include: [
        models.Employment,
        models.Job,
        models.Schedule,
        {
          model: models.Work,
          where: { end: { [Op.gt]: new Date() } },
          required: false,
          include: [models.Schedule],
        },
      ],
    })
    return res.send(employees)
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
      include: [
        models.Employment,
        models.Job,
        models.Schedule,
        {
          model: models.Work,
          // where: { end: { [Op.gt]: new Date() } },
          required: false,
          include: [models.Schedule],
        },
      ],
    })

    if (employee === null)
      return res
        .status(404)
        .send({ error: "Mitarbeiter konnte nicht gefunden werden." })
    return res.send(employee)
  })

  // Create one
  router.post("/", roles.requireAdmin, async (req, res) => {
    try {
      await models.Employee.create({
        name: req.body.name,
        initials: req.body.initials,
      })
      return res.send({ message: "Mitarbeiter wurde erfolgreich erstellt." })
    } catch (error) {
      if (error.message && error.message === "Validation error")
        return res
          .status(400)
          .send({ error: "Das Kürzel des Mitarbeiters existiert bereits" })
      return res.status(400).send({ error: error.message })
    }
  })

  // Update one
  router.put("/:id", roles.requireAdmin, async (req, res) => {
    try {
      const employee = await models.Employee.findByPk(req.params.id)

      if (!employee)
        return res.status(400).send({ error: "Mitarbeiter nicht gefunden" })

      await models.Employee.update(
        {
          short: req.body.short,
          title: req.body.title,
          employmentId: req.body.employmentId,
        },
        {
          where: { id: employee.id },
        }
      )

      if (req.body.jobIds) {
        await models.JobEmployee.destroy({
          where: { employeeId: employee.id },
        })
        await models.JobEmployee.bulkCreate(
          req.body.jobIds.map((jobId) => {
            return { jobId: jobId, employeeId: employee.id }
          })
        )
      }
      if (req.body.scheduleIds) {
        await models.ScheduleEmployee.destroy({
          where: { employeeId: employee.id },
        })
        await models.ScheduleEmployee.bulkCreate(
          req.body.scheduleIds.map((scheduleId) => {
            return { scheduleId: scheduleId, employeeId: employee.id }
          })
        )
      }
      if (req.body.workIds) {
        await models.WorkEmployee.destroy({
          where: { employeeId: employee.id },
        })
        await models.WorkEmployee.bulkCreate(
          req.body.workIds.map((workId) => {
            return { workId: workId, employeeId: employee.id }
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
      if (response === 0)
        return res
          .status(404)
          .send({ error: "Mitarbeiter konnte nicht gefunden werden" })
      return res.status(200).send({ message: "Mitarbeiter gelöscht" })
    } catch (error) {
      return res.status(400).send({ error: error.message })
    }
  })

  return router
}
