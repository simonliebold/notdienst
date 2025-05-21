module.exports = (Sequelize) => {
  return new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASS,
    {
      host: process.env.DB_HOST,
      dialect: "mariadb",
    }
  )
}
