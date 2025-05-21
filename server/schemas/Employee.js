const mongoose = require("mongoose")
const { Schema, model } = mongoose

const freetimeSchema = new Schema({
  start: Date,
  end: Date,
})

const employeeSchema = new Schema({
  short: { type: String, uppercase: true, required: true },
  title: { type: String, required: true },
  employment: { type: Schema.Types.ObjectId, ref: "Employment" },
  freetimes: [freetimeSchema],
  //   jobIds: [{ type: Schema.Types.ObjectId, ref: "Job", required: true }],
})

module.exports = model("Employee", employeeSchema)
