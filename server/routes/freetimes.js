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
  // TODO: add freetime to multiple schedules
  router.post("/", async (req, res) => {
    try {
      const params = ["start", "end", "scheduleId"]
      const found = params.every((param) => req.body[param] !== undefined)
      if (!found) throw new Error("Params missing")

      const start = new Date(req.body.start)
      const end = new Date(req.body.end)
      if (isNaN(start.valueOf()) || isNaN(end.valueOf()))
        throw new Error("Date invalid")

      if (start >= end) throw new Error("Start must be before end")

      const schedule = await models.Schedule.findByPk(req.body.scheduleId)
      if (schedule === null) throw new Error("Schedule not found")

      const employee = await models.Employee.findByPk(req.body.employeeId)
      if (employee === null) throw new Error("Employee not found")

      if (start < schedule.start || end > schedule.end)
        throw new Error("Freetime must be during schedule time")

      const response = await models.Freetime.create({
        start: start,
        end: end,
        scheduleId: schedule.id,
        employeeId: req.user.id,
      })
      return res.send({ response: response })
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
