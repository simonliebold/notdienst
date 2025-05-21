const db = require("./database.js")
const models = require("./models.js")(db)

const express = require("express")
const app = express()
app.use(express.json())

const helmet = require("helmet")
app.use(helmet())

// TODO: Add authentification

const routes = require("./routes")(models, db.sequelize)
app.use("/", routes)

const port = process.env.PORT || 3000
app.listen(port, async () => {
  console.log("App listening on port " + port)
  try {
    await db.sequelize.authenticate()
    console.log(
      "Connected to database " +
        process.env.DB_NAME +
        " (" +
        process.env.DB_HOST +
        ") successfully"
    )
  } catch (error) {
    console.error("Unable to connect to the database:", error)
  }
  // await sequelize.sync({ force: true })
  // require("./example")(models)
})
