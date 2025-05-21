const mongoose = require("mongoose")
const Employee = require("./Employee")
const { Schema } = mongoose

const jobSchema = new Schema({
  short: { type: String, uppercase: true, required: true },
  title: {type: String, required: true},
})


module.exports = mongoose.model("Job", jobSchema)
