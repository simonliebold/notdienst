const mongoose = require("mongoose")
const Employee = require("./Employee")
const { Schema } = mongoose

const jobSchema = new Schema({
  short: { type: String, uppercase: true },
  title: String,
  employees: [{ type: Schema.Types.ObjectId, ref: "Employee" }],
})

const cascadeEmployees = async (job) => {
  if (!job.isModified("employees")) return
  await Employee.updateMany(
    { _id: { $in: job.employees } },
    { $addToSet: { jobs: job._id } }
  )
}

jobSchema.pre("save", async function (next) {
  await cascadeEmployees(this)
  next()
})

module.exports = mongoose.model("Job", jobSchema)
