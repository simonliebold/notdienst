const mongoose = require("mongoose")
const { Schema } = mongoose

const rruleSchema = new Schema({
  short: { type: String, uppercase: true, required: true, unique: true },
  title: { type: String, required: true },
  start: { type: String, required: true },
  end: { type: String, required: true },
  content: { type: String, required: true },
  shiftId: {
    type: Schema.Types.ObjectId,
    ref: "Shift",
    required: true,
  },
})

module.exports = mongoose.model("Rrule", rruleSchema)
