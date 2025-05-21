const mongoose = require("mongoose")
const { Schema, model } = mongoose

const shiftSchema = new Schema({
  short: { type: String, uppercase: true, required: true },
  title: { type: String, required: true },
  jobIds: [{ type: Schema.Types.ObjectId, ref: "Job", required: true }],
})

module.exports = model("Shift", shiftSchema)
