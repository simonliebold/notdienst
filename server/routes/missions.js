module.exports = (models) => {
  const router = require("express").Router()
  const roles = require("../roles")

  // Get all
  router.get("/", roles.requireAdmin, async (req, res) => {
    const missions = await models.Mission.findAll({
      include: [models.Work, models.Employee],
    })
    return res.send(missions)
  })

  // Get one
  router.get("/:id", roles.requireAdmin, async (req, res) => {
    const mission = await models.Mission.findByPk(req.params.id, {
      include: [models.Work, models.Employee],
    })
    if (mission === null) return res.sendStatus(404)
    return res.send(mission)
  })

  // Create one
  // router.post("/", async (req, res) => {
  //   try {
  //     const params = ["start", "end", "scheduleId"]
  //     const found = params.every((param) => req.body[param] !== undefined)
  //     if (!found) throw new Error("Params missing")

  //     const start = new Date(req.body.start)
  //     const end = new Date(req.body.end)
  //     if (isNaN(start.valueOf()) || isNaN(end.valueOf()))
  //       throw new Error("Date invalid")

  //     if (start >= end) throw new Error("Start must be before end")

  //     const schedule = await models.Schedule.findByPk(req.body.scheduleId)
  //     if (schedule === null) throw new Error("Schedule not found")

  //     const employee = await models.Employee.findByPk(req.body.employeeId)
  //     if (employee === null) throw new Error("Employee not found")

  //     if (start < schedule.start || end > schedule.end)
  //       throw new Error("Mission must be during schedule time")

  //     const response = await models.Mission.create({
  //       start: start,
  //       end: end,
  //       scheduleId: schedule.id,
  //       employeeId: req.user.id,
  //     })
  //     return res.send({ response: response })
  //   } catch (error) {
  //     return res.status(400).send({ error: error.message })
  //   }
  // })

  // Update one
  router.put("/:id", roles.requireAdmin, async (req, res) => {
    try {
      const mission = await models.Mission.findByPk(req.params.id)
      await models.Mission.update(
        { type: req.body.type, info: req.body.info, time: req.body.time },
        {
          where: { id: mission.id },
        }
      )
      return res.status(200).send({ message: "Änderungen gespeichert" })
    } catch (error) {
      return res.status(400).send({ error: error.message })
    }
  })

  // Delete one
  // router.delete("/:id", async (req, res) => {
  //   try {
  //     const response = await models.Mission.destroy({
  //       where: { id: req.params.id, employeeId: req.user.id },
  //     })
  //     if (response === 0) return res.sendStatus(404)
  //     return res.status(200).send({ message: "Deleted successfully" })
  //   } catch (error) {
  //     res.status(400).send({ errors: error.message })
  //   }
  // })

  return router
}
