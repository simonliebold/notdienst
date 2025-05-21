module.exports = {
  isAdmin: (role) => {
    return Math.floor(role) === 10
  },
}
