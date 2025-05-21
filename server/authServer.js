const express = require("express")
const app = express()
const { Sequelize, DataTypes } = require("sequelize")
const bcrypt = require("bcrypt")
const helmet = require("helmet")
const cors = require("cors")

app.use(express.json())
app.use(helmet())
app.use(cors())

const sequelize = new Sequelize(
  process.env.AUTH_DB_NAME,
  process.env.AUTH_DB_USER,
  process.env.AUTH_DB_PASS,
  {
    host: process.env.AUTH_DB_HOST,
    dialect: "mariadb",
  }
)

const CredentialsCode = sequelize.define(
  "credentialsCodes",
  {
    code: {
      type: DataTypes.STRING(4),
      allowNull: false,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
    },
    expiresAt: {
      type: DataTypes.DATE,
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
        if (!value.match(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/))
          throw new Error(
            "Das Passwort muss mindestens 8 Zeichen lang sein und einen Buchstaben und eine Nummer enthalten"
          )
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

CredentialsCode.belongsTo(User)

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
    email: "lieb@lie-bold.de",
    password: "liebold1",
  })
  await sequelize.models.users.create({
    id: 2,
    email: "rer@lie-bold.de",
    password: "rerucha2",
    role: 10,
  })
})
