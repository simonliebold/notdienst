const mongoose = require("mongoose")
const { Schema, model } = mongoose

const workSchema = new Schema({
  short: { type: String, uppercase: true, required: true },
  title: { type: String, required: true },
  start: { type: Date, required: true },
  end: { type: Date, required: true },
  shiftId: { type: Schema.Types.ObjectId, ref: "Shift" },
  scheduleId: { type: Schema.Types.ObjectId, ref: "Schedule", required: true },
  jobIds: [{ type: Schema.Types.ObjectId, ref: "Job", required: true }],
  employeeIds: [{ type: Schema.Types.ObjectId, ref: "Employee" }],
})

module.exports = model("Work", workSchema)
