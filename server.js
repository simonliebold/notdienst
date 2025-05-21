const db = require("./database.js")
const models = require("./models.js")(db)

const express = require("express")
const app = express()
app.use(express.json())

const helmet = require("helmet")
app.use(helmet())

// TODO: add rate limit https://express-rate-limit.mintlify.app/quickstart/usage

// JWT Authentification
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]
  if (token == null) return res.sendStatus(401)

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403)
    req.user = user
    next()
  })
}

const routes = require("./routes.js")(models, db.sequelize)
app.use("/", authenticateToken, routes)
// app.use("/", routes)

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
  await db.sequelize.sync()
  // await db.sequelize.sync({ force: true })
  // require("./example.js")(models)
})
