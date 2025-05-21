module.exports = (sequelize) => {
  const router = require("express").Router()
  const jwt = require("jsonwebtoken")
  const bcrypt = require("bcrypt")

  function generateAccessToken(user) {
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "1d" })
  }

  function generateCredentialsToken(user) {
    return jwt.sign(user, process.env.CREDENTIALS_TOKEN_SECRET, {
      expiresIn: "1d",
    })
  }

  function authenticateCredentialsToken(req, res, next) {
    const authHeader = req.headers["authorization"]
    const token = authHeader && authHeader.split(" ")[1]
    if (token == null) return res.sendStatus(401)
    req.credentialsToken = token

    jwt.verify(token, process.env.CREDENTIALS_TOKEN_SECRET, (err, user) => {
      if (err) return res.sendStatus(401)
      req.user = user
      next()
    })
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
  router.post("/credentials/:id", authenticateAccessToken, async (req, res) => {
    if (req.user.role < 10 && req.user.id !== Math.floor(req.params.id))
      return res.sendStatus(403)
    let user = await sequelize.models.users.findByPk(req.params.id)
    if (user === null) return res.sendStatus(404)
    user = user.dataValues
    delete user.password
    const token = generateCredentialsToken(user)

    const codeString = "ABCDEFGHIJKLMNPQRSTUVWXYZ123456789"
    let code = ""
    for (let i = 0; i < 4; i++) {
      code += codeString.charAt(Math.floor(Math.random() * codeString.length))
    }
    try {
      const credentialsToken = await sequelize.models.credentialsTokens.create({
        code: code,
        token: token,
      })
      return res.send({ code: credentialsToken.code })
    } catch (error) {
      return res.sendStatus(400)
    }
  })

  // Get credentials token by code
  router.get("/credentials/:code", async (req, res) => {
    const credentialsToken = await sequelize.models.credentialsTokens.findOne({
      where: { code: req.params.code },
    })
    if (credentialsToken === null) return res.sendStatus(404)
    const token = credentialsToken.token
    await credentialsToken.destroy()
    return res.send({ token: token })
  })

  // Change email / password
  router.post(
    "/credentials",
    authenticateCredentialsToken,
    async (req, res) => {
      try {
        const [count, user] = await sequelize.models.users.update(
          {
            email: req.body.email,
            password: req.body.password,
          },
          { where: { id: req.user.id }, individualHooks: true }
        )
        if (count < 1) return res.sendStatus(400)
        return res.sendStatus(200)
      } catch (error) {
        return res.status(400).send({ error: error.message })
      }
    }
  )

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
