module.exports = (sequelize) => {
  const router = require("express").Router()
  const jwt = require("jsonwebtoken")

  function generateAccessToken(user) {
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "1d" })
  }

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
