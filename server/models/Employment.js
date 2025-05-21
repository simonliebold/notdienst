const mongoose = require("mongoose")
const { Schema } = mongoose

const employmentSchema = new Schema({
  short: { type: String, uppercase: true, required: true, unique: true },
  title: String,
  minHours: Number,
  maxHours: Number,
})

module.exports = mongoose.model("Employment", employmentSchema)
