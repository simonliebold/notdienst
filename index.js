const express = require("express")
const app = express()

const { Sequelize } = require("sequelize")
const sequelize = require("./database.js")(Sequelize)
const models = require("./models.js")(sequelize)

app.get("/", (req, res) => {
  res.send("Hello World!")
})

app.listen(3000, async () => {
  console.log("App listening on port 3000!")
  try {
    await sequelize.authenticate()
    console.log("Connection has been established successfully.")
    console.log(models.Employee.findOne())
    await sequelize.sync()
  } catch (error) {
    console.error("Unable to connect to the database:", error)
  }
})
