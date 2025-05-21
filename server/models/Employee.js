const mongoose = require("mongoose")
const { Schema, model } = mongoose

const employeeSchema = new Schema({
  short: { type: String, uppercase: true, required: true },
  title: { type: String, required: true },
  employmentId: { type: Schema.Types.ObjectId, ref: "Employment" },
  jobIds: [{ type: Schema.Types.ObjectId, ref: "Job", required: true }],
})

module.exports = model("Employee", employeeSchema)
