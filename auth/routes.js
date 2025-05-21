const mongoose = require("mongoose")
const User = require("./models/User")
const RefreshToken = require("./models/RefreshToken")

const router = require("express").Router()
const jwt = require("jsonwebtoken")
const CredentialsToken = require("./models/CredentialsToken")

function generateAccessToken(user) {
  // const expirationDate = Math.floor(Date.now() / 1000)
  const expirationDate = Math.floor(Date.now() / 1000) + 180000
  return jwt.sign(
    { ...user, exp: expirationDate },
    process.env.ACCESS_TOKEN_SECRET
  )
}

function authenticateAccessToken(req, res, next) {
  const authHeader = req.headers["authorization"]
  const token = authHeader && authHeader.split(" ")[1]
  if (token == null)
    return res.status(403).send({ error: "Authentifizierung fehlgeschlagen" })

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) {
      if (err.name === "TokenExpiredError")
        res.status(401).send({ error: "Die Sitzung ist abgelaufen" })
      return res.status(403).send({ error: "Authentifizierung fehlgeschlagen" })
    }
    req.user = user
    next()
  })
}

// Generate credentials token
router.post(
  "/credentials/generate/:id",
  authenticateAccessToken,
  async (req, res) => {
    if (req.user.role < 10 && req.user.id !== Math.floor(req.params.id))
      return res.sendStatus(403)

    const user = await User.findById(req.params.id)
    if (!user) await User.create({ _id: req.params.id })
    // let users = await sequelize.models.users.findOrCreate({
    //   where: { id: req.params.id },
    // })
    // if (users === null)
    //   return res
    //     .status(404)
    //     .send({ error: "Nutzer konnte nicht gefunden werden" })

    const now = new Date()
    const expiresAt = now.setDate(now.getDate() + 1)
    const codeString = "ABCDEFGHIJKLMNPQRSTUVWXYZ123456789"
    let code = ""
    for (let i = 0; i < 4; i++) {
      code += codeString.charAt(Math.floor(Math.random() * codeString.length))
    }
    try {
      await CredentialsToken.deleteMany({ userId: req.params.id })
      const token = await CredentialsToken.create({
        code: code,
        userId: req.params.id,
        expiresAt: expiresAt,
      })
      // await sequelize.models.credentialsCodes.destroy({
      //   where: { userId: req.params.id },
      // })
      // const credentialsCode = await sequelize.models.credentialsCodes.create({
      //   code: code,
      //   userId: req.params.id,
      //   expiresAt: expiresAt,
      // })

      return res.send(token)
    } catch (error) {
      return res.status(400).send({ error: error.message })
    }
  }
)

// Check if token is expired
router.get("/credentials/check/:code", async (req, res) => {
  let credentialsCode = await sequelize.models.credentialsCodes.findOne({
    where: { code: req.params.code },
    include: sequelize.models.users,
  })
  if (credentialsCode === null || credentialsCode.expiresAt < Date.now())
    return res
      .status(404)
      .send({ error: "Der eingegebene Code konnte nicht gefunden werden." })
  credentialsCode = credentialsCode.dataValues
  return res.send({
    code: credentialsCode.code,
    email: credentialsCode.user.email,
  })
})

// Change email / password
router.post("/credentials/change/:code", async (req, res) => {
  const credentialsCode = await CredentialsToken.findOne({
    code: req.body.code,
  })
  // const credentialsCode = await sequelize.models.credentialsCodes.findByPk(
  //   req.params.code
  // )
  if (credentialsCode === null || credentialsCode.expiresAt < Date.now())
    return res
      .status(404)
      .send({ error: "Der eingegebene Code konnte nicht gefunden werden." })

  if (req.body.password === null || req.body.password === null)
    return res.status(400).send({
      error: "Bitte lege eine E-Mail-Adresse und ein Passwort fest.",
    })

  try {
    await User.updateOne(
      { _id: credentialsCode.userId },
      { email: req.body.email, password: req.body.password }
    )
    // const [count, users] = await sequelize.models.users.update(
    //   {
    //     email: req.body.email,
    //     password: req.body.password,
    //   },
    //   { where: { id: credentialsCode.userId }, individualHooks: true }
    // )
    // if (count < 1)
    //   return res.status(400).send({
    //     error: "Es wurden keine Änderungen vorgenommen.",
    //   })

    await CredentialsToken.deleteOne({ code: req.params.code })
    // await sequelize.models.credentialsCodes.destroy({
    //   where: { code: req.params.code },
    // })

    return res
      .status(200)
      .send({ message: "Account-Daten erfolgreich festgelegt" })
  } catch (error) {
    next(error)
  }
})

// Refresh token
router.post("/token", async (req, res) => {
  try {
    const refreshToken = req.body.token
    if (refreshToken == null) return res.sendStatus(403)
    if ((await RefreshToken.findOne({ token: refreshToken })) === undefined)
      return res.sendStatus(403)
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
      if (err) return res.sendStatus(403)
      const accessToken = generateAccessToken(user)
      res.json({ accessToken: accessToken })
    })
  } catch (err) {
    console.log(err)
    return res.sendStatus(400)
  }
})

// Destroy refreshtoken
router.delete("/logout", async (req, res) => {
  try {
    await RefreshToken.deleteOne({ token: req.body.token })
    // await sequelize.models.refreshTokens.destroy({
    //   where: { token: req.body.token },
    // })
    return res.sendStatus(204)
  } catch (error) {
    return res.sendStatus(500)
  }
})

// Login by email and password
router.post("/login", async (req, res) => {
  if (req.body.email === undefined || req.body.password === undefined)
    return res
      .status(403)
      .send({ error: "E-Mail-Adresse oder Passwort fehlen." })
  const user = await User.findOne({ email: req.body.email })
  if (!user)
    return res
      .status(403)
      .send({ error: "E-Mail-Adresse oder Passwort sind nicht korrekt." })

  // return res.json(await user.comparePassword(req.body.password))
  if (!(await user.comparePassword(req.body.password)))
    return res
      .status(403)
      .send({ error: "E-Mail-Adresse oder Passwort sind nicht korrekt." })

  const data = {
    id: user._id,
    email: user.email,
    tel: user.tel,
    role: user.role,
  }

  const accessToken = generateAccessToken(data)
  const refreshToken = jwt.sign(data, process.env.REFRESH_TOKEN_SECRET)
  await RefreshToken.create({ token: refreshToken })
  // return res.json(accessToken)
  return res.json({ accessToken: accessToken, refreshToken: refreshToken })
})

module.exports = router
