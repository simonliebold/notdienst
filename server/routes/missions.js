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
  router.delete("/:id", roles.requireAdmin, async (req, res) => {
    try {
      const mission = await models.Mission.destroy({
        where: { id: req.params.id },
      })
      return res.status(200).send("Erfolgreich gelöscht")
    } catch (error) {
      res.status(400).send({ error: error.message })
    }
  })

  // Create one
  router.post("/", roles.requireAdmin, async (req, res) => {
    try {
      const mission = await models.Mission.create({
        type: req?.body?.type,
        info: req?.body?.info,
        time: req?.body?.time,
        km: req?.body?.km,
        employeeId: req.user.id,
        workId: req?.body?.workId,
      })
      return res.send(mission)
    } catch (error) {
      return res.status(400).send({ error: error.message })
    }
  })

  return router
}
