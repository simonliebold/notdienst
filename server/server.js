const db = require("./database.js")
const models = require("./models.js")(db)

const mongoose = require("mongoose")
const Employee = require("./schemas/Employee.js")
const Employment = require("./schemas/Employment.js")
const Job = require("./schemas/Job.js")

const express = require("express")
const app = express()
app.use(express.json())

const helmet = require("helmet")
app.use(helmet())

const jwt = require("jsonwebtoken")

const cors = require("cors")
const loadTestData = require("./testData.js")
app.use(cors())

// TODO: add rate limit https://express-rate-limit.mintlify.app/quickstart/usage

// JWT Authentification
function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"]
  const token = authHeader && authHeader.split(" ")[1]
  if (token == null)
    return res.status(403).send({ error: "Authentifizierung fehlgeschlagen" })

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) {
      if (err.name === "TokenExpiredError")
        return res.status(401).send({ error: "Die Sitzung ist abgelaufen" })
      return res.status(403).send({ error: "Authentifizierung fehlgeschlagen" })
    }
    req.user = user
    next()
  })
}

// Error handling
const handleError = (err, req, res, next) => {
  return res.status(400).send({ error: err.message })
}

const routes = require("./routes.js")(models, db.sequelize)
app.use("/", authenticateToken, routes, handleError)
 

const port = process.env.PORT || 3000
app.listen(port, async () => {
  console.log("App listening on port " + port)
  try {
    // await db.sequelize.authenticate()
    // console.log(
    //   "Connected to database " +
    //     process.env.DB_NAME +
    //     " (" +
    //     process.env.DB_HOST +
    //     ") successfully"
    // )

    await mongoose.connect(process.env.MONGO_CONN)
    console.log("Connected to db")
    
    await loadTestData()
    console.log("Test data loaded")

  } catch (error) {
    console.error("Unable to connect to the database:", error)
  }
  // await db.sequelize.sync()
  // await db.sequelize.sync({ force: true })
  // require("./example.js")(models)
})
