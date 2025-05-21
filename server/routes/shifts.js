module.exports = (models) => {
  const router = require("express").Router()

  // Get all
  router.get("/", async (req, res) => {
    const shifts = await models.Shift.findAll({
      include: [models.Schedule, models.Job],
    })
    res.send(shifts)
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
      const shift = await models.Shift.create({
        short: req.body.short,
        title: req.body.title,
      })
      res.send(shift)
    } catch (error) {
      res.status(400).send({ error: error.message })
    }
  })

  // Update one
  router.put("/:id", async (req, res) => {
    try {
      const shift = await models.Shift.findByPk(req.params.id)
      await models.Shift.update(
        { short: req.body.short, title: req.body.title },
        {
          where: { id: shift.id },
        }
      )

      if (req.body.jobIds) {
        await models.JobShift.destroy({
          where: { shiftId: shift.id },
        })
        await models.JobShift.bulkCreate(
          req.body.jobIds.map((jobId) => {
            return { jobId: jobId, shiftId: shift.id }
          })
        )
      }

      if (req.body.scheduleIds) {
        await models.ScheduleShift.destroy({
          where: { shiftId: shift.id },
        })
        await models.ScheduleShift.bulkCreate(
          req.body.scheduleIds.map((scheduleId) => {
            return { scheduleId: scheduleId, shiftId: shift.id }
          })
        )
      }
      return res.status(200).send({ message: "Änderungen gespeichert" })
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
