const mongoose = require("mongoose")
const Employee = require("./Employee")
const { Schema } = mongoose

const jobSchema = new Schema({
  short: { type: String, uppercase: true },
  title: String,
})


module.exports = mongoose.model("Job", jobSchema)
