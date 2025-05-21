module.exports = (models) => {
  const router = require("express").Router()

  // Get all
  router.get("/", async (req, res) => {
    const rrules = await models.Rrule.findAll({ include: models.Shift })

    return res.send(rrules)
  })

  // Get one
  router.get("/:id", async (req, res) => {
    const rrule = await models.Rrule.findByPk(req.params.id, {
      include: models.Shift,
    })
    if (!rrule)
      return res.status(404).send({ message: "Rrule nicht gefunden." })

    return res.send(rrule)
  })

  // Update one
  router.put("/:id", async (req, res) => {
    try {
      const rrule = await models.Rrule.findByPk(req.params.id)

      if (!rrule) return res.status(400).send({ error: "Rrule nicht gefunden" })

      await models.Rrule.update(
        {
          short: req.body.short,
          title: req.body.title,
          content: req.body.content,
          shiftId: req.body.shiftId
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

  return router
}
