module.exports = (models) => {
  const router = require("express").Router()

  // Get all
  router.get("/", async (req, res) => {
    const response = await models.Freetime.findAll()
    res.send({ response: response })
  })

  // Get one
  router.get("/:id", async (req, res) => {
    const response = await models.Freetime.findByPk(req.params.id)
    if (response === null) res.status(404).send({ message: "Not found" })
    else console.log(new Date("2023-10-01T08:00:00.00"))
    res.send({ response: response })
  })

  // Create one
  router.post("/", async (req, res) => {
    try {
      const params = ["start", "end", "scheduleId", "employeeId"]
      const found = params.every((param) => req.body[param] !== undefined)
      if (!found) throw new Error("Params missing")

      const start = new Date(req.body.start)
      const end = new Date(req.body.end)
      if (isNaN(start.valueOf()) || isNaN(end.valueOf()))
        throw new Error("Date invalid")

      if (start >= end) throw new Error("Start must be before end")

      const schedule = await models.Schedule.findByPk(req.body.scheduleId)
      if (schedule === null) throw new Error("Schedule not found")

      const employee = await models.Employee.findByPk(req.body.employeeId)
      if (employee === null) throw new Error("Employee not found")

      if (start < schedule.start || end > schedule.end)
        throw new Error("Freetime must be during schedule time")

      const response = await models.Freetime.create({
        start: start,
        end: end,
        scheduleId: schedule.id,
        employeeId: employee.id,
      })
      res.send({ response: response })
    } catch (error) {
      res.status(400).send({ error: error.message })
    }
  })

  // Update one
  // Add error handling
  router.put("/:id", async (req, res) => {
    try {
      const response = await models.Freetime.update(
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

  // Delete one
  // TODO: delete by schedule id
  router.delete("/:id", async (req, res) => {
    try {
      const response = await models.Freetime.destroy({
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
