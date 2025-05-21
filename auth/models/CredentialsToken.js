const { Schema, model } = require("mongoose")

const credentialsTokenSchema = new Schema({
  code: {
    type: String,
    uppercase: true,
    required: true,
    minlength: 4,
    maxlength: 4,
  },
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  expiresAt: { type: Date, required: true },
})

module.exports = model("CredentialsToken", credentialsTokenSchema)