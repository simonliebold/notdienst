module.exports = (models, sequelize) => {
  const router = require("express").Router()
  const roles = require("./roles.js")

  const requireAdmin = (req, res, next) => {
    if (!roles.isAdmin(req.user.role)) return res.sendStatus(403)
    next()
  }

  const employments = require("./routes/employments")(models)
  router.use("/employments", requireAdmin, employments)

  const jobs = require("./routes/jobs")(models)
  router.use("/jobs", requireAdmin, jobs)
  
  const shifts = require("./routes/shifts")(models)
  router.use("/shifts", requireAdmin, shifts)
  
  const events = require("./routes/events")(models)
  router.use("/events", requireAdmin, events)
  
  const schedules = require("./routes/schedules")(models, sequelize)
  router.use("/schedules", requireAdmin, schedules)

  
  const freetimes = require("./routes/freetimes")(models)
  router.use("/freetimes", freetimes)

  const employees = require("./routes/employees")(models)
  router.use("/employees", employees)

  const works = require("./routes/works")(models)
  router.use("/works", works)

  return router
}
