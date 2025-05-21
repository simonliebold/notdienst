const { Sequelize } = require("sequelize")

module.exports = (sequelize) => {
  return sequelize.define(
    "employment",
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
      minHours: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      maxHours: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
    },
    { timestamps: false }
  )
}
