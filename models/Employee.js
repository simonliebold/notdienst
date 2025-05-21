const { Sequelize } = require("sequelize")

module.exports = (sequelize) => {
  return sequelize.define(
    "employee",
    {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      initials: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: false,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      employmentId: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
    },
    { timestamps: false }
  )
}
