const { Schema, model } = require("mongoose")

const refreshTokenSchema = new Schema({
  token: { type: String, required: true },
})

module.exports = model("RefreshToken", refreshTokenSchema)
