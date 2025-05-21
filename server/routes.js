module.exports = (models, sequelize) => {
  const router = require("express").Router()
  const roles = require("./roles.js")

  const employments = require("./routes/employments.js")(models)
  router.use("/employments", roles.requireAdmin, employments)

  const jobs = require("./routes/jobs.js")(models)
  router.use("/jobs", roles.requireAdmin, jobs)

  const shifts = require("./routes/shifts.js")(models)
  router.use("/shifts", roles.requireAdmin, shifts)

  const rrules = require("./routes/rrules.js")(models)
  router.use("/rrules", roles.requireAdmin, rrules)

  const employees = require("./routes/employees.js")(models)
  router.use("/employees", employees)

  const schedules = require("./routes/schedules.js")(models, sequelize)
  router.use("/schedules", schedules)

  const freetimes = require("./routes/freetimes.js")(models)
  router.use("/freetimes", freetimes)

  const works = require("./routes/works.js")(models)
  router.use("/works", works)

  // const missions = require('./routes/missions.js')(models)
  // router.use("/missions", missions)

  return router
}
