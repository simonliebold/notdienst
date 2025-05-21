const express = require("express")
const app = express()
const { Sequelize, DataTypes } = require("sequelize")

app.use(express.json())

const sequelize = new Sequelize(
  process.env.AUTH_DB_NAME,
  process.env.AUTH_DB_USER,
  process.env.AUTH_DB_PASS,
  {
    host: process.env.AUTH_DB_HOST,
    dialect: "mariadb",
  }
)

sequelize.define(
  "refreshTokens",
  {
    token: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
  },
  { timestamps: false }
)

sequelize.define(
  "users",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
    },
    email: {
      type: DataTypes.STRING,
    },
    password: {
      type: DataTypes.STRING,
    },
    role: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 1
    },
  },
  { timestamps: false }
)

const routes = require("./authRoutes")(sequelize)
app.use("/", routes)

const PORT = process.env.AUTH_PORT || 4000
app.listen(PORT, async () => {
  console.log("Auth server listening on port " + PORT)
  try {
    await sequelize.authenticate()
    console.log(
      "Connected to database " +
        process.env.AUTH_DB_NAME +
        " (" +
        process.env.AUTH_DB_HOST +
        ") successfully"
    )
  } catch (error) {
    console.error("Unable to connect to the auth database:", error)
  }
  // await db.sequelize.sync()
  await sequelize.sync({ force: true })
  await sequelize.models.users.create({id: 1, email: "simon@bitel.net", password: "lieb"})
  await sequelize.models.users.create({id: 2, email: "rerucha", password: "rer", role: 10})
})
