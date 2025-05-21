const express = require("express")
const app = express()
const helmet = require("helmet")
const cors = require("cors")
const mongoose = require("mongoose")
const routes = require("./routes")
const User = require("./models/User")

app.use(express.json())
app.use(helmet())
app.use(cors())

app.use("/", routes)

const PORT = process.env.AUTH_PORT || 4000

app.listen(PORT, async () => {
  console.log("Auth server listening on port " + PORT)
  await mongoose.connect(process.env.MONGO_CONN)
  console.log("Connected to db")
  // new User({
  //   _id: "65c74826b3bd0e5e4d467b3f",
  //   email: "lbd",
  //   password: "lbd",
  //   role: "10",
  // }).save()
})
