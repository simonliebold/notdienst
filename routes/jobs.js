module.exports = (models) => {
  const router = require("express").Router()

  // Get all
  router.get("/", async (req, res) => {
    const response = await models.Job.findAll()
    res.send({ response: response })
  })

  // Get one
  router.get("/:id", async (req, res) => {
    const response = await models.Job.findByPk(req.params.id)
    if (response === null) res.status(404).send({ message: "Not found" })
    else res.send({ response: response })
  })

  // Create one
  router.post("/", async (req, res) => {
    try {
      const response = await models.Job.create({ ...req.body })
      res.send({ response: response })
    } catch (error) {
      res.status(400).send({ errors: error.errors })
    }
  })

  // Update one
  router.put("/:id", async (req, res) => {
    try {
      const response = await models.Job.update(
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
      res.status(400).send({ errors: error })
    }
  })

  // TODO: Add Employee to Job 

  // Delete one
  router.delete("/:id", async (req, res) => {
    try {
      const response = await models.Job.destroy({
        where: { id: req.params.id },
      })
      response > 0
        ? res.status(200).send({ message: "Deleted successfully" })
        : res.status(404).send({ message: "Not found" })
    } catch (error) {
      res.status(400).send({ errors: error })
    }
  })

  return router
}
