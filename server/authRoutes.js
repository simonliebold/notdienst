module.exports = (sequelize) => {
  const router = require("express").Router()
  const jwt = require("jsonwebtoken")

  function generateAccessToken(user) {
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "1m" })
  }

  function authenticateToken(req, res, next) {
    const authHeader = req.headers["authorization"]
    const token = authHeader && authHeader.split(" ")[1]
    if (token == null) return res.sendStatus(401)

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
      if (err) return res.sendStatus(401)
      req.user = user
      next()
    })
  }

  router.post("/generate/:id", authenticateToken, async (req, res) => {
    if (req.user.role < 10) return res.sendStatus(403)
    let user = await sequelize.models.users.findByPk(req.params.id)
    if (user === undefined) return res.sendStatus(404)
    user = user.dataValues
    delete user.password
    const token = generateAccessToken(user)

    const codeString = "ABCDEFGHIJKLMNPQRSTUVWXYZ123456789"
    let code = ""
    for (let i = 0; i < 4; i++) {
      code += codeString.charAt(Math.floor(Math.random() * codeString.length))
    }
    const accountToken = await sequelize.models.accountTokens.create({
      code: code,
      token: token,
      userId: req.params.id,
    })
    res.send(accountToken)
  })

  router.get("/token/:code", async (req, res) => {
    const token = await sequelize.models.accountTokens.findOne({
      where: { code: req.params.code },
      include: sequelize.models.users
    })
    if (token === null) return res.sendStatus(404)

    return res.send({ token: token.token })
  })

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

  // TODO: !! find by email
  router.post("/login", async (req, res) => {
    let user = await sequelize.models.users.findByPk(req.body.id)
    if (user === undefined) return res.sendStatus(401)
    if (user.password !== req.body.password) return res.sendStatus(401)
    user = user.dataValues
    delete user.password
    const accessToken = generateAccessToken(user)
    const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET)
    await sequelize.models.refreshTokens.create({ token: refreshToken })
    return res.json({ accessToken: accessToken, refreshToken: refreshToken })
  })

  // TODO: user creation
  // TODO: password reset / password encryption
  return router
}
