module.exports = (models) => {
  const router = require("express").Router()

  const employments = require("./routes/employments")(models)
  router.use("/employments", employments)

  const employees = require("./routes/employees")(models)
  router.use("/employees", employees)

  const jobs = require("./routes/jobs")(models)
  router.use("/jobs", jobs)

  return router
}
