const { Op } = require("sequelize")
module.exports = (models) => {
  const router = require("express").Router()

  // Get all
  router.get("/", async (req, res) => {
    const jobs = await models.Job.findAll({
      include: [models.Employee, models.Shift],
    })
    res.send(jobs)
  })

  // Get one
  router.get("/:id", async (req, res) => {
    const job = await models.Job.findByPk(req.params.id, {
      include: [models.Employee, models.Shift],
    })
    if (job === null) res.status(404).send({ message: "Job nicht gefunden" })
    else res.send(job)
  })

  // Create one
  router.post("/", async (req, res) => {
    try {
      const job = await models.Job.create({ ...req.body })
      res.send({ job: job })
    } catch (error) {
      res.status(400).send({ error: error })
    }
  })

  // Update one
  router.put("/:id", async (req, res) => {
    try {
      const job = await models.Job.update(
        { ...req.body },
        {
          where: { id: req.params.id },
        }
      )
      job[0] > 0
        ? res
            .status(200)
            .send({ message: "Updated successfully", rows: job[0] })
        : res.status(404).send({ message: "Not found", rows: job[0] })
    } catch (error) {
      res.status(400).send({ error: error })
    }
  })

  // Delete one
  router.delete("/:id", async (req, res) => {
    try {
      const job = await models.Job.destroy({
        where: { id: req.params.id },
      })
      job > 0
        ? res.status(200).send({ message: "Deleted successfully" })
        : res.status(404).send({ message: "Not found" })
    } catch (error) {
      res.status(400).send({ error: error })
    }
  })

  // Get all employees
  router.get("/:id/employee", async (req, res) => {
    const job = await models.JobEmployee.findAll({
      where: { jobId: req.params.id },
    })
    res.send({ job: job })
  })

  // Add Employees to Job
  router.post("/:id/employee", async (req, res) => {
    try {
      const job = await models.JobEmployee.bulkCreate(
        req.body.employeeIds.map((employeeId) => ({
          jobId: req.params.id,
          employeeId: employeeId,
        }))
      )
      res.send({ job: job })
    } catch (error) {
      res.status(400).send({ error: error })
    }
  })

  // Delete Employees from Job
  router.delete("/:id/employee", async (req, res) => {
    try {
      const employeeIds = req.body.employeeIds.map((val) => {
        return { employeeId: val }
      })
      const job = await models.JobEmployee.destroy({
        where: {
          [Op.and]: [
            { jobId: req.params.id },
            {
              [Op.or]: [...employeeIds],
            },
          ],
        },
      })
      job > 0
        ? res.status(200).send({ message: "Deleted successfully" })
        : res.status(404).send({ message: "Not found" })
    } catch (error) {
      res.status(400).send({ error: error })
    }
  })

  // Get all shifts
  router.get("/:id/shift", async (req, res) => {
    const job = await models.JobShift.findAll({
      where: { jobId: req.params.id },
    })
    res.send({ job: job })
  })

  // Add Shifts to Job
  router.post("/:id/shift", async (req, res) => {
    try {
      const job = await models.JobShift.bulkCreate(
        req.body.shiftIds.map((shiftId) => ({
          jobId: req.params.id,
          shiftId: shiftId,
        }))
      )
      res.send({ job: job })
    } catch (error) {
      res.status(400).send({ error: error })
    }
  })

  // Delete Shifts from Job
  router.delete("/:id/shift", async (req, res) => {
    try {
      const shiftIds = req.body.shiftIds.map((val) => {
        return { shiftId: val }
      })
      const job = await models.JobShift.destroy({
        where: {
          [Op.and]: [
            { jobId: req.params.id },
            {
              [Op.or]: [...shiftIds],
            },
          ],
        },
      })
      job > 0
        ? res.status(200).send({ message: "Deleted successfully" })
        : res.status(404).send({ message: "Not found" })
    } catch (error) {
      res.status(400).send({ error: error })
    }
  })

  return router
}
