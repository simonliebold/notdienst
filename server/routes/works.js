module.exports = (models) => {
  const router = require("express").Router()
  const roles = require("./../roles")

  // Get all
  router.get("/", roles.requireAdmin, async (req, res) => {
    const works = await models.Work.findAll({
      include: [
        { model: models.Rrule, include: models.Shift },
        models.Schedule,
        models.Employee,
      ],
    })
    res.send(works)
  })

  // Get one
  router.get("/:id", roles.requireAdmin, async (req, res) => {
    const work = await models.Work.findByPk(req.params.id, {
      include: [
        { model: models.Rrule, include: models.Shift },
        models.Schedule,
        models.Employee,
      ],
    })
    if (!work) return res.status(404).send({ error: "Dienst nicht gefunden" })

    const missions = await models.Mission.findAll({
      where: { workId: work.id },
    })

    return res.send({
      id: work.id,
      title: work.title,
      short: work.short,
      start: work.start,
      end: work.end,
      employees: work.employees,
      rrule: work.rrule,
      schedule: work.schedule,
      missions: missions,
    })
  })

  // Create one
  router.post("/", roles.requireAdmin, async (req, res) => {
    try {
      const work = await models.Work.create({
        start: req.body.start,
        end: req.body.end,
        scheduleId: req.body.scheduleId,
      })
      res.send(work)
    } catch (error) {
      res.status(400).send({ error: error.message })
    }
  })

  // Update one
  router.put("/:id", roles.requireAdmin, async (req, res) => {
    try {
      const work = await models.Work.findByPk(req.params.id)
      await models.Work.update(
        {
          short: req.body.short,
          title: req.body.title,
          start: req.body.start,
          end: req.body.end,
        },
        {
          where: { id: req.params.id },
        }
      )
      if (req.body.employeeIds) {
        await models.WorkEmployee.destroy({
          where: { workId: work.id },
        })
        await models.WorkEmployee.bulkCreate(
          req.body.employeeIds.map((employeeId) => {
            return { workId: work.id, employeeId: employeeId }
          })
        )
      }

      return res.status(200).send({ message: "Änderungen gespeichert" })
    } catch (error) {
      return res.status(400).send({ error: error.message })
    }
  })

  // Delete one
  router.delete("/:id", roles.requireAdmin, async (req, res) => {
    try {
      const response = await models.Work.destroy({
        where: { id: req.params.id },
      })
      if (response === 0) return res.sendStatus(404)
      return res.status(200).send({ message: "Deleted successfully" })
    } catch (error) {
      return res.status(400).send({ error: error.message })
    }
  })

  // Delete all by schedule id
  router.delete("/schedule/:id", roles.requireAdmin, async (req, res) => {
    try {
      const response = await models.Work.destroy({
        where: { scheduleId: req.params.id },
      })
      if (response === 0) return res.sendStatus(404)
      return res.status(200).send({ message: "Deleted successfully" })
    } catch (error) {
      return res.status(400).send({ error: error.message })
    }
  })

  return router
}
