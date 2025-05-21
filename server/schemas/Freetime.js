const mongoose = require("mongoose")
const { Schema } = mongoose

const freetimeSchema = new Schema({
  short: { type: String, uppercase: true, required: true },
  title: { type: String, required: true },
  start: { type: Date, required: true },
  end: { type: Date, required: true },
  employeeId: {
    type: Schema.Types.ObjectId,
    ref: "Employment",
    required: true,
  },
})

module.exports = mongoose.model("Freetime", freetimeSchema)
