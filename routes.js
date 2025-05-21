module.exports = (models, sequelize) => {
  const router = require("express").Router()
  const roles = require("./roles.js")

  const employments = require("./routes/employments")(models)
  router.use("/employments", roles.requireAdmin, employments)

  const jobs = require("./routes/jobs")(models)
  router.use("/jobs", roles.requireAdmin, jobs)
  
  const shifts = require("./routes/shifts")(models)
  router.use("/shifts", roles.requireAdmin, shifts)
  
  const events = require("./routes/events")(models)
  router.use("/events", roles.requireAdmin, events)
  
  const employees = require("./routes/employees")(models)
  router.use("/employees", employees)
  
  const schedules = require("./routes/schedules")(models, sequelize)
  router.use("/schedules", schedules)

  const freetimes = require("./routes/freetimes")(models)
  router.use("/freetimes", freetimes)
  
  const works = require("./routes/works")(models)
  router.use("/works", works)

  return router
}
