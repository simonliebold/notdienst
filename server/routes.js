const router = require("express").Router()
const roles = require("./roles.js")

const employments = require("./routes/employments.js")
router.use("/employments", roles.requireAdmin, employments)

const jobs = require("./routes/jobs.js")
router.use("/jobs", roles.requireAdmin, jobs)

const shifts = require("./routes/shifts.js")
router.use("/shifts", roles.requireAdmin, shifts)

const rrules = require("./routes/rrules.js")
router.use("/rrules", roles.requireAdmin, rrules)

const employees = require("./routes/employees.js")
router.use("/employees", employees)

const schedules = require("./routes/schedules.js")
router.use("/schedules", schedules)

const freetimes = require("./routes/freetimes.js")
router.use("/freetimes", freetimes)

const works = require("./routes/works.js")
router.use("/works", works)

const exchanges = require("./routes/exchanges.js")
router.use("/exchanges", exchanges)

// const missions = require('./routes/missions.js')
// router.use("/missions", missions)

module.exports = router
