module.exports = (models) => {
  const router = require("express").Router()

  // Get all
  router.get("/", async (req, res) => {
    const shifts = await models.Shift.findAll()
    res.send({ values: shifts })
  })

  // Get one
  router.get("/:id", async (req, res) => {
    const shift = await models.Shift.findByPk(req.params.id, {
      include: [models.Schedule, models.Job],
    })
    if (shift === null)
      return res.status(404).send({ message: "Schicht nicht gefunden" })

    const rrules = await models.Rrule.findAll({
      where: { shiftId: req.params.id },
    })
    return res.send({ ...shift.dataValues, rrules: rrules })
  })

  // Create one
  router.post("/", async (req, res) => {
    try {
      const response = await models.Shift.create({ ...req.body })
      res.send({ response: response })
    } catch (error) {
      res.status(400).send({ error: error })
    }
  })

  // Update one
  router.put("/:id", async (req, res) => {
    try {
      const response = await models.Shift.update(
        { ...req.body },
        {
          where: { id: req.params.id },
        }
      )
      response[0] > 0
        ? res
            .status(200)
            .send({ message: "Updated successfully", rows: response[0] })
        : res.status(404).send({ message: "Not found", rows: response[0] })
    } catch (error) {
      res.status(400).send({ error: error })
    }
  })

  // Delete one
  router.delete("/:id", async (req, res) => {
    try {
      const response = await models.Shift.destroy({
        where: { id: req.params.id },
      })
      response > 0
        ? res.status(200).send({ message: "Deleted successfully" })
        : res.status(404).send({ message: "Not found" })
    } catch (error) {
      res.status(400).send({ error: error })
    }
  })

  return router
}
