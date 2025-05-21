const { Op } = require("sequelize")

module.exports = (models) => {
  const router = require("express").Router()

  // Get all
  router.get("/", async (req, res) => {
    const employments = await models.Employment.findAll()
    res.send(employments)
  })

  // Get one
  router.get("/:id", async (req, res) => {
    const employment = await models.Employment.findByPk(req.params.id)
    if (employment === null)
      return res
        .status(404)
        .send({ message: "Anstellungsverhältnis nicht gefunden" })

    const employees = await models.Employee.findAll({
      where: { employmentId: req.params.id },
    })
    return res.send({ ...employment.dataValues, employees })
  })

  // Create one
  router.post("/", async (req, res) => {
    try {
      const employment = await models.Employment.create({ ...req.body })
      res.send({ employment: employment })
    } catch (error) {
      res.status(400).send({ error: error })
    }
  })

  // Update one
  router.put("/:id", async (req, res) => {
    try {
      const employment = await models.Employment.findByPk(req.params.id)

      if (!employment)
        return res
          .status(400)
          .send({ error: "Anstellungsverhältnis nicht gefunden" })
      await models.Employment.update(
        {
          short: req.body?.short,
          title: req.body?.title,
          minHours: req.body?.minHours,
          maxHours: req.body?.maxHours,
        },
        {
          where: { id: req.params.id },
        }
      )

      if (req.body?.employeeIds) {
        await models.Employee.update(
          { employmentId: null },
          {
            where: {
              employmentId: employment.id,
            },
          }
        )
        await models.Employee.update(
          { employmentId: employment.id },
          {
            where: {
              [Op.or]: req.body.employeeIds.map((id) => {
                return { id: id }
              }),
            },
          }
        )
      }

      return res.status(200).send({ message: "Änderungen gespeichert" })
    } catch (error) {
      res.status(400).send({ error: error.message })
    }
  })

  // Delete one
  router.delete("/:id", async (req, res) => {
    try {
      const employment = await models.Employment.destroy({
        where: { id: req.params.id },
      })
      employment > 0
        ? res.status(200).send({ message: "Deleted successfully" })
        : res.status(404).send({ message: "Not found" })
    } catch (error) {
      res.status(400).send({ error: error })
    }
  })

  return router
}
