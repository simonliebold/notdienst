const mongoose = require("mongoose")
const { Schema, model } = mongoose

const scheduleSchema = new Schema({
  short: { type: String, uppercase: true, required: true },
  title: { type: String, required: true },
})

module.exports = model("Schedule", scheduleSchema)
