const { Op } = require("sequelize")
module.exports = (models) => {
  const router = require("express").Router()

  // Get all
  router.get("/", async (req, res) => {
    const response = await models.Schedule.findAll()
    res.send({ response: response })
  })

  // Get one
  router.get("/:id", async (req, res) => {
    const response = await models.Schedule.findByPk(req.params.id)
    if (response === null) res.status(404).send({ message: "Not found" })
    else res.send({ response: response })
  })

  // Create one
  router.post("/", async (req, res) => {
    try {
      const response = await models.Schedule.create({ ...req.body })
      res.send({ response: response })
    } catch (error) {
      res.status(400).send({ error: error })
    }
  })

  // Update one
  router.put("/:id", async (req, res) => {
    try {
      const response = await models.Schedule.update(
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

  // Delete one
  router.delete("/:id", async (req, res) => {
    try {
      const response = await models.Schedule.destroy({
        where: { id: req.params.id },
      })
      response > 0
        ? res.status(200).send({ message: "Deleted successfully" })
        : res.status(404).send({ message: "Not found" })
    } catch (error) {
      res.status(400).send({ error: error })
    }
  })

  // Get all employees
  router.get("/:id/employee", async (req, res) => {
    const response = await models.ScheduleEmployee.findAll({
      where: { scheduleId: req.params.id },
    })
    res.send({ response: response })
  })

  // Add Employees to Job
  router.post("/:id/employee", async (req, res) => {
    try {
      const response = await models.ScheduleEmployee.bulkCreate(
        req.body.employeeIds.map((employeeId) => ({
          scheduleId: req.params.id,
          employeeId: employeeId,
        }))
      )
      res.send({ response: response })
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
      const response = await models.ScheduleEmployee.destroy({
        where: {
          [Op.and]: [
            { scheduleId: req.params.id },
            {
              [Op.or]: [...employeeIds],
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

  // Get all shifts
  router.get("/:id/shift", async (req, res) => {
    const response = await models.ScheduleShift.findAll({
      where: { scheduleId: req.params.id },
    })
    res.send({ response: response })
  })

  // Add Shifts to Job
  router.post("/:id/shift", async (req, res) => {
    try {
      const response = await models.ScheduleShift.bulkCreate(
        req.body.shiftIds.map((shiftId) => ({
          scheduleId: req.params.id,
          shiftId: shiftId,
        }))
      )
      res.send({ response: response })
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
      const response = await models.ScheduleShift.destroy({
        where: {
          [Op.and]: [
            { scheduleId: req.params.id },
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

  // Get schedule->employees
  const getEmployees = async (req, res, next) => {
    const schedule = await models.Schedule.findByPk(req.params.id, {
      include: {
        model: models.Employee,
        through: { attributes: [] },
        include: models.Employment,
      },
    })
    if (schedule === null)
      res.status(404).send({ message: "No employees found" })
    req.employees = schedule.dataValues.employees.map((e) => {
      return {
        id: e.id,
        initials: e.initials,
        minHours: e.employment.minHours,
        maxHours: e.employment.maxHours,
        possibleHours: 0,
        workHours: 0,
      }
    })
    next()
  }

  // Get events->shift->jobs->employees
  const getEvents = async (req, res, next) => {
    const events = await models.Event.findAll({
      include: [
        {
          model: models.Shift,
          include: [
            {
              model: models.Job,
              through: { attributes: [] },
              include: {
                model: models.Employee,
                through: { attributes: [] },
              },
            },
            {
              model: models.Schedule,
              through: { where: { scheduleId: req.params.id }, attributes: [] },
            },
          ],
        },
      ],
    })
    if (events === null) res.status(404).send({ message: "No events found" })
    req.events = events.map((event) => event.dataValues)

    next()
  }

  return router
}
