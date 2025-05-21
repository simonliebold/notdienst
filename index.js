const { Sequelize } = require("sequelize")
const sequelize = require("./database.js")(Sequelize)
const models = require("./models.js")(sequelize)

const express = require("express")
const app = express()
app.use(express.json())

// TODO: Add authentification

const routes = require("./routes")(models)
app.use("/", routes)

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
