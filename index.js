const express = require("express")
const app = express()

const { Sequelize, DataTypes } = require("sequelize")

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST,
    dialect: "mariadb",
  }
)

const Employee = require("./models/Employee")(sequelize)
const Job = require("./models/Job")(sequelize)
const Employment = require("./models/Employment")(sequelize)
const Shift = require("./models/Shift")(sequelize)
const Event = require("./models/Event")(sequelize)
const Work = require("./models/Work")(sequelize)
const Schedule = require("./models/Schedule")(sequelize)
const Freetime = require("./models/Freetime")(sequelize)

Employee.belongsTo(Employment)

Work.belongsTo(Schedule)
Work.belongsTo(Event)

Freetime.belongsTo(Schedule)
Freetime.belongsTo(Employee)

Event.belongsTo(Shift)

Job.belongsToMany(Employee, { through: "JobEmployee" })
Employee.belongsToMany(Job, { through: "JobEmployee" })

Job.belongsToMany(Shift, { through: "JobShift" })
Shift.belongsToMany(Job, { through: "JobShift" })

Schedule.belongsToMany(Shift, { through: "ScheduleShift" })
Shift.belongsToMany(Schedule, { through: "ScheduleShift" })

Schedule.belongsToMany(Employee, { through: "ScheduleEmployee" })
Employee.belongsToMany(Schedule, { through: "ScheduleEmployee" })

app.get("/", (req, res) => {
  res.send("Hello World!")
})

app.listen(3000, async () => {
  console.log("App listening on port 3000!")
  try {
    await sequelize.authenticate()
    console.log("Connection has been established successfully.")
    await sequelize.sync({ force: true })
  } catch (error) {
    console.error("Unable to connect to the database:", error)
  }
})
