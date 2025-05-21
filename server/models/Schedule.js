const mongoose = require("mongoose")
const { Schema, model } = mongoose

const scheduleSchema = new Schema({
  short: { type: String, uppercase: true, required: true, unique: true },
  title: { type: String, required: true },
  start: { type: Date, required: true },
  end: { type: Date, required: true },
})

module.exports = model("Schedule", scheduleSchema)
