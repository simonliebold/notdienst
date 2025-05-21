module.exports = (models) => {
  const router = require("express").Router()
  const roles = require("./../roles")

  // Get all
  router.get("/", roles.requireAdmin, async (req, res) => {
    const freetimes = await models.Freetime.findAll({
      include: [models.Schedule, models.Employee],
    })
    return res.send(freetimes)
  })

  // Get one
  router.get("/:id", roles.requireAdmin, async (req, res) => {
    const freetime = await models.Freetime.findByPk(req.params.id, {
      include: [models.Schedule, models.Employee],
    })
    if (freetime === null) return res.sendStatus(404)
    return res.send(freetime)
  })

  // Create one
  // TODO: check if freetime is in schedule bounds
  router.post("/", async (req, res) => {
    try {
      const freetime = await models.Freetime.create({
        type: req?.body?.type,
        date: req?.body?.date,
        scheduleId: req?.body?.scheduleId,
        employeeId: req?.body?.employeeId,
      })
      return res.send(freetime)
    } catch (error) {
      return res.status(400).send({ error: error.message })
    }
  })

  // Update one
  // TODO: Add error handling
  router.put("/:id", roles.requireAdmin, async (req, res) => {
    try {
      const response = await models.Freetime.update(
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
  // TODO: enable deletion by admin
  // router.delete("/:id", async (req, res) => {
  //   try {
  //     const response = await models.Freetime.destroy({
  //       where: { id: req.params.id, employeeId: req.user.id },
  //     })
  //     if (response === 0) return res.sendStatus(404)
  //     return res.status(200).send({ message: "Deleted successfully" })
  //   } catch (error) {
  //     res.status(400).send({ errors: error.message })
  //   }
  // })
  router.delete("/:id", roles.requireAdmin, async (req, res) => {
    try {
      const freetime = await models.Freetime.destroy({
        where: { id: req.params.id },
      })
      if (freetime === 0)
        return res
          .status(404)
          .send({ error: "Dienstplanwunsch nicht gefunden" })
      return res
        .status(200)
        .send({ message: "Dienstplanwunsch erfolgreich gelöscht" })
    } catch (error) {
      res.status(400).send({ error: error.message })
    }
  })

  return router
}
