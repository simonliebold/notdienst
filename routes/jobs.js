const { Op } = require("sequelize")
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

  // Get all employees
  router.get("/:id/employee", async (req, res) => {
    const response = await models.JobEmployee.findAll({
      where: { jobId: req.params.id },
    })
    res.send({ response: response })
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

  // Get all shifts
  router.get("/:id/shift", async (req, res) => {
    const response = await models.JobShift.findAll({
      where: { jobId: req.params.id },
    })
    res.send({ response: response })
  })

  // Add Shift to Job
  router.post("/:id/shift", async (req, res) => {
    try {
      const response = await models.JobShift.bulkCreate(
        req.body.shiftIds.map((shiftId) => ({
          jobId: req.params.id,
          shiftId: shiftId,
        }))
      )
      res.send({ response: response })
    } catch (error) {
      res.status(400).send({ error: error })
    }
  })

  // Delete Shift from Job
  router.delete("/:id/shift", async (req, res) => {
    const shiftIds = req.body.shiftIds.map((val) => {
      return {
        shiftId: val,
      }
    })
    console.log(shiftIds)
    try {
      const response = await models.JobShift.destroy({
        where: {
          [Op.and]: [
            { jobId: req.params.id },
            {
              [Op.or]: [...shiftIds],
            },
          ],
        },
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

  // TODO: enable adding / removing multiple employees / shifts

  return router
}
