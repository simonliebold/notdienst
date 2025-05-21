module.exports = (models) => {
  const router = require("express").Router()
  const roles = require("./../roles")

  // Get all
  router.get("/", roles.requireAdmin, async (req, res) => {
    const rrules = await models.Rrule.findAll({ include: models.Shift })

    return res.send(rrules)
  })

  // Get one
  router.get("/:id", roles.requireAdmin, async (req, res) => {
    const rrule = await models.Rrule.findByPk(req.params.id, {
      include: models.Shift,
    })
    if (!rrule)
      return res.status(404).send({ message: "Rrule nicht gefunden." })

    return res.send(rrule)
  })

  // Update one
  router.put("/:id", roles.requireAdmin, async (req, res) => {
    try {
      const rrule = await models.Rrule.findByPk(req.params.id)

      if (!rrule) return res.status(400).send({ error: "Rrule nicht gefunden" })

      await models.Rrule.update(
        {
          short: req.body.short,
          title: req.body.title,
          content: req.body.content,
          shiftId: req.body.shiftId,
        },
        {
          where: { id: req.params.id },
        }
      )

      return res.status(200).send({ message: "Änderungen gespeichert" })
    } catch (error) {
      res.status(400).send({ error: error })
    }
  })

  // Create one
  router.post("/", roles.requireAdmin, async (req, res) => {
    try {
      const rrule = await models.Rrule.create({
        short: req.body.short,
        title: req.body.title,
        content: req.body.content,
        shiftId: req.body.shiftId,
      })
      return res.send(rrule)
    } catch (error) {
      return res.status(400).send({ error: error.message })
    }
  })

  return router
}
