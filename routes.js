module.exports = (models) => {
  const router = require("express").Router()

  const employments = require("./routes/employments")(models)
  router.use("/employments", employments)

  const employees = require("./routes/employees")(models)
  router.use("/employees", employees)

  const jobs = require("./routes/jobs")(models)
  router.use("/jobs", jobs)

  const shifts = require("./routes/shifts")(models)
  router.use("/shifts", shifts)

  const events = require("./routes/events")(models)
  router.use("/events", events)

  // TODO: create routes for all models

  return router
}
