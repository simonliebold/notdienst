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

  return router
}
