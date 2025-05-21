module.exports = {
  requireAdmin: (req, res, next) => {
    if (Math.floor(req.user.role) !== 10) return res.sendStatus(403)
    next()
  },
}
