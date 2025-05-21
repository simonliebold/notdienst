const { Sequelize } = require("sequelize")
const sequelize = require("./database.js")(Sequelize)
const models = require("./models.js")(sequelize)

const express = require("express")
const app = express()
app.use(express.json())

// TODO: Add authentification

const employments = require("./routes/employments")(models)
app.use("/employments", employments)

const employees = require("./routes/employees")(models)
app.use("/employees", employees)

const jobs = require("./routes/jobs")(models)
app.use("/jobs", jobs)

const port = process.env.PORT || 3000

app.listen(port, async () => {
  console.log("App listening on port 3000!")
  try {
    await sequelize.authenticate()
    console.log("Connection has been established successfully.")
  } catch (error) {
    console.error("Unable to connect to the database:", error)
  }
  await sequelize.sync()
})
