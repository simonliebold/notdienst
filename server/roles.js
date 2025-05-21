module.exports = {
  requireAdmin: (req, res, next) => {
    if (Math.floor(req.user.role) !== 10) return res.status(403).send({error: "Dazu hast du nicht die benötigten Rechte"})
    next()
  },
}
