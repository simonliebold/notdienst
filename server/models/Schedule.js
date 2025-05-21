const { Sequelize } = require("sequelize")

module.exports = (sequelize) => {
  return sequelize.define(
    "schedule",
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
      start: {
        type: Sequelize.DATEONLY,
        allowNull: false,
      },
      end: {
        type: Sequelize.DATEONLY,
        allowNull: false,
      },
      deadline: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    },
    { timestamps: false }
  )
}
