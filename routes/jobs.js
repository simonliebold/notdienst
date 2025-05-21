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
      res.status(400).send({ error: error })
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
      res.status(400).send({ error: error })
    }
  })

  // Add Employee to Job
  router.post("/:id/employee", async (req, res) => {
    try {
      const response = await models.JobEmployee.create({
        jobId: req.params.id,
        employeeId: req.body.employeeId,
      })
      res.send({ response: response })
    } catch (error) {
      res.status(400).send({ error: error })
    }
  })

  // Delete Employee from Job
  router.delete("/:id/employee", async (req, res) => {
    try {
      const response = await models.JobEmployee.destroy({
        where: { jobId: req.params.id, employeeId: req.body.employeeId },
      })
      response > 0
        ? res.status(200).send({ message: "Deleted successfully" })
        : res.status(404).send({ message: "Not found" })
    } catch (error) {
      res.status(400).send({ error: error })
    }
  })
  
  // Add Shift to Job
  router.post("/:id/shift", async (req, res) => {
    try {
      const response = await models.JobShift.create({
        jobId: req.params.id,
        shiftId: req.body.shiftId,
      })
      res.send({ response: response })
    } catch (error) {
      res.status(400).send({ error: error })
    }
  })

  // Delete Shift from Job
  router.delete("/:id/shift", async (req, res) => {
    try {
      const response = await models.JobShift.destroy({
        where: { jobId: req.params.id, shiftId: req.body.shiftId },
      })
      response > 0
        ? res.status(200).send({ message: "Deleted successfully" })
        : res.status(404).send({ message: "Not found" })
    } catch (error) {
      res.status(400).send({ error: error })
    }
  })

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
      res.status(400).send({ error: error })
    }
  })

  return router
}
