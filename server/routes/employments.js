module.exports = (models) => {
  const router = require("express").Router()

  // Get all
  router.get("/", async (req, res) => {
    const employments = await models.Employment.findAll()
    res.send({ employments: employments })
  })

  // Get one
  router.get("/:id", async (req, res) => {
    const employment = await models.Employment.findByPk(req.params.id)
    if (employment === null) return res.status(404).send({ message: "Anstellungsverhältnis nicht gefunden" })
    
    const employees = await models.Employee.findAll({where: {employmentId: req.params.id}})
    return res.send({...employment.dataValues, employees})
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
      const employment = await models.Employment.update(
        { ...req.body },
        {
          where: { id: req.params.id },
        }
      )
      employment[0] > 0
        ? res
            .status(200)
            .send({ message: "Updated successfully", rows: employment[0] })
        : res.status(404).send({ message: "Not found", rows: employment[0] })
    } catch (error) {
      res.status(400).send({ error: error })
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
