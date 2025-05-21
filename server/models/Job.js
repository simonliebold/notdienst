const { Sequelize } = require("sequelize")
module.exports = (sequelize) => {
  return sequelize.define(
    "job",
    {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      title: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
    },
    { timestamps: false }
  )
}
