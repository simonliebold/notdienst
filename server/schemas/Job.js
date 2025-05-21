const mongoose = require("mongoose")
const { Schema } = mongoose

const jobSchema = new Schema({
  short: { type: String, uppercase: true },
  title: String,
  employeeIds: [{ type: Schema.Types.ObjectId, ref: 'Employee' }]
})

module.exports = mongoose.model("Job", jobSchema)
