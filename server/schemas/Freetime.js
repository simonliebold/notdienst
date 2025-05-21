const mongoose = require("mongoose")
const { Schema } = mongoose

const freetimeSchema = new Schema({
  short: String,
  title: String,
  start: Date,
  end: Date,
  employeeId: { type: Schema.Types.ObjectId, ref: "Employment" },
})

module.exports = mongoose.model("Freetime", freetimeSchema)
