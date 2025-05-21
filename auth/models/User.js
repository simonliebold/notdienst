const { Schema, model } = require("mongoose")
const bcrypt = require("bcrypt")

const userSchema = new Schema({
  email: { type: String, unique: true, required: false },
  tel: { type: String, required: false },
  password: { type: String, required: false },
  role: { type: Number, required: true, default: "1" },
})

userSchema.pre("save", async function (next) {
  const user = this
  if (!user.isModified("password")) return next()

  try {
    // if (!user.password.match(/^(?=.*[A-Za-z])(?=.*\d).{8,}$/))
    //   throw new Error(
    //     "Das Passwort muss mindestens 8 Zeichen lang sein und einen Buchstaben und eine Zahl enthalten"
    //   )
    const hash = await bcrypt.hash(user.password, 10)
    user.password = hash
    next()
  } catch (error) {
    return next(error)
  }
})

userSchema.methods.comparePassword = async function (candidatePassword) {
  // try {
  return await bcrypt.compare(candidatePassword, this.password)
  // } catch (error) {
  //   throw new Error(error)
  // }
}

module.exports = model("User", userSchema)
