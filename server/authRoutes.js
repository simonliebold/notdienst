module.exports = (sequelize) => {
  const router = require("express").Router()
  const jwt = require("jsonwebtoken")
  const bcrypt = require("bcrypt")
  const nodemailer = require("nodemailer")

  const transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_PORT,
    secure: process.env.MAIL_SECURE,
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
    },
  })

  function generateAccessToken(user) {
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "1d" })
  }

  function authenticateAccessToken(req, res, next) {
    const authHeader = req.headers["authorization"]
    const token = authHeader && authHeader.split(" ")[1]
    if (token == null) return res.sendStatus(401)

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
      if (err) return res.sendStatus(401)
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
      let user = await sequelize.models.users.findByPk(req.params.id)
      if (user === null) return res.sendStatus(404)

      const now = new Date()
      const expiresAt = now.setDate(now.getDate() + 1)
      const codeString = "ABCDEFGHIJKLMNPQRSTUVWXYZ123456789"
      let code = ""
      for (let i = 0; i < 6; i++) {
        code += codeString.charAt(Math.floor(Math.random() * codeString.length))
      }
      try {
        await sequelize.models.credentialsCodes.destroy({
          where: { userId: user.id },
        })
        const credentialsCode = await sequelize.models.credentialsCodes.create({
          code: code,
          userId: user.id,
          expiresAt: expiresAt,
        })

        return res.send(credentialsCode)
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
    const credentialsCode = await sequelize.models.credentialsCodes.findByPk(
      req.params.code
    )
    if (credentialsCode === null || credentialsCode.expiresAt < Date.now())
      return res
        .status(404)
        .send({ error: "Der eingegebene Code konnte nicht gefunden werden." })

    try {
      const [count, users] = await sequelize.models.users.update(
        {
          email: req.body.email,
          password: req.body.password,
        },
        { where: { id: credentialsCode.userId }, individualHooks: true }
      )
      if (count < 1)
        return res.status(400).send({
          error: "Es wurden keine Änderungen vorgenommen.",
        })

      if (users[0].password === null || users[0].password === null)
        return res
          .status(400)
          .send({ error: "Bitte lege eine E-Mail-Adresse und ein Passwort fest." })
      await sequelize.models.credentialsCodes.destroy({
        where: { code: req.params.code },
      })
      // await transporter.sendMail({
      //   from: '"ASB" <asb@lie-bold.de>',
      //   to: users[0].email,
      //   subject: "Account-Daten erfolgreich geändert",
      // })
      return res
        .status(200)
        .send({ message: "Account-Daten erfolgreich geändert" })
    } catch (error) {
      return res.status(400).send({ error: error.message })
    }
  })

  // Refresh token
  router.post("/token", async (req, res) => {
    const refreshToken = req.body.token
    if (refreshToken == null) return res.sendStatus(401)
    if (sequelize.models.refreshTokens.findByPk(refreshToken) === undefined)
      return res.sendStatus(403)
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
      if (err) return res.sendStatus(403)
      const accessToken = generateAccessToken({ name: user.name })
      res.json({ accessToken: accessToken })
    })
  })

  // Destroy refreshtoken
  router.delete("/logout", async (req, res) => {
    try {
      await sequelize.models.refreshTokens.destroy({
        where: { token: req.body.token },
      })
    } catch (error) {
      return res.sendStatus(500)
    }
    res.sendStatus(204)
  })

  const validPassword = async (password, input) => {
    return await bcrypt.compare(input, password)
  }

  // Login by email and password
  router.post("/login", async (req, res) => {
    if (req.body.email === undefined || req.body.password === undefined)
      return res.sendStatus(401)
    let user = await sequelize.models.users.findOne({
      where: { email: req.body.email },
    })
    if (!user) return res.sendStatus(401)
    if (!(await validPassword(user.password, req.body.password)))
      return res.sendStatus(401)
    user = user.dataValues
    delete user.password
    const accessToken = generateAccessToken(user)
    const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET)
    await sequelize.models.refreshTokens.create({ token: refreshToken })
    return res.json({ accessToken: accessToken, refreshToken: refreshToken })
  })

  return router
}
