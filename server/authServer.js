const express = require("express")
const app = express()
const { Sequelize, DataTypes } = require("sequelize")
const bcrypt = require("bcrypt")

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
  "credentialsTokens",
  {
    code: {
      type: DataTypes.STRING(4),
      allowNull: false,
      primaryKey: true,
    },
    token: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  { timestamps: false }
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

const User = sequelize.define(
  "users",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      set(value) {
        const salt = bcrypt.genSaltSync()
        this.setDataValue("password", bcrypt.hashSync(value, salt))
      },
    },
    role: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 1,
    },
  },
  {
    timestamps: false,
  }
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
  await sequelize.models.users.create({
    id: 1,
    email: "lieb@asb.de",
    password: "lieb",
  })
  await sequelize.models.users.create({
    id: 2,
    email: "rer@asb.de",
    password: "rer",
    role: 10,
  })
})
