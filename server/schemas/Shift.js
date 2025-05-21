const mongoose = require("mongoose")
const { Schema, model } = mongoose

const rruleSchema = new Schema({
  start: { type: String, required: true },
  end: { type: String, required: true },
  content: { type: String, required: true },
})

const shiftSchema = new Schema({
  short: { type: String, uppercase: true, required: true },
  title: { type: String, required: true },
  rrules: [rruleSchema],
  jobIds: [{ type: Schema.Types.ObjectId, ref: "Job", required: true }],
})

module.exports = model("Shift", shiftSchema)
