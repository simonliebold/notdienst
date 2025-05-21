module.exports = (models) => {
  const router = require("express").Router()
  const roles = require("./../roles")

  // Get all
  router.get("/", roles.requireAdmin, async (req, res) => {
    try {
      const response = await models.Work.findAll()
      res.send({ response: response })
    } catch (error) {
      return res.status(400).send({ error: error.message })
    }
  })

  // Get (self) all by schedule id
  // TODO: delete employees for works
  router.get("/self/schedule/:id", async (req, res) => {
    try {
      const works = await models.Work.findAll({
        include: {
          model: models.Employee,
          where: { id: req.user.id },
          through: { attributes: [] },
        },
        where: { scheduleId: req.params.id },
      })
      if (works === null) return res.sendStatus(404)
      return res.send({ works: works })
    } catch (error) {
      return res.status(400).send({ error: error.message })
    }
  })

  // Get one
  router.get("/:id", roles.requireAdmin, async (req, res) => {
    try {
      const work = await models.Work.findByPk(req.params.id)
      if (work === null) return res.sendStatus(404)
      return res.send({ work: work })
    } catch (error) {
      return res.status(400).send({ error: error.message })
    }
  })

  // Create one
  router.post("/", roles.requireAdmin, async (req, res) => {
    try {
      const work = await models.Work.create({ ...req.body })
      res.send({ work: work })
    } catch (error) {
      res.status(400).send({ error: error.message })
    }
  })

  // Update one
  router.put("/:id", roles.requireAdmin, async (req, res) => {
    try {
      const response = await models.Work.update(
        { ...req.body },
        {
          where: { id: req.params.id },
        }
      )
      if (response[0] === 0) return res.sendStatus(404)
      return res.status(200).send({ message: "Updated successfully" })
    } catch (error) {
      return res.status(400).send({ errors: error })
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
      return res.status(400).send({ errors: error })
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

  // TODO: ! add / remove employee from work
  return router
}
