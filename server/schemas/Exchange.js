const mongoose = require("mongoose")
const { Schema, model } = mongoose

const exchangeSchema = new Schema({
  short: { type: String, uppercase: true, required: true },
  title: { type: String, required: true },
  status: {
    type: String,
    enum: ["Angebot", "Beantragt", "Bestätigt"],
    required: true,
  },
  outgoingId: { type: Schema.Types.ObjectId, ref: "Work", required: true },
  incomingId: { type: Schema.Types.ObjectId, ref: "Work" },
  senderIds: [{ type: Schema.Types.ObjectId, ref: "Employee", required: true }],
  receiverIds: [{ type: Schema.Types.ObjectId, ref: "Employee" }],
})

module.exports = model("Exchange", exchangeSchema)
