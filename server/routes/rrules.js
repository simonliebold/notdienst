module.exports = (models) => {
  const router = require("express").Router()

  router.get("/:id", async (req, res) => {
    const rrule = await models.Rrule.findByPk(req.params.id, {include: models.Shift})
    if (!rrule)
      return res.status(404).send({ message: "Rrule nicht gefunden." })

    return res.send(rrule)
  })

  return router
}
