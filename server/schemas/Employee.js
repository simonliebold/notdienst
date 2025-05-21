const mongoose = require("mongoose")
const Job = require("./Job")
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
  jobs: [{ type: Schema.Types.ObjectId, ref: "Job", required: true }],
})

const cascadeJobs = async (employee) => {
  if (!employee.isModified("jobs")) return
  await Job.updateMany(
    { _id: { $in: employee.jobs } },
    { $addToSet: { employees: employee._id } }
  )
}

employeeSchema.pre("save", async function (next) {
  await cascadeJobs(this)
  next()
})

module.exports = model("Employee", employeeSchema)
