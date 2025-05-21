const { Sequelize } = require("sequelize")

module.exports = (sequelize) => {
  return sequelize.define(
    "event",
    {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      title: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      requiredEmployees: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 1
      },
      timeStart: {
        type: Sequelize.TIME,
        allowNull: false,
      },
      timeEnd: {
        type: Sequelize.TIME,
        allowNull: false,
      },
      repeatWeekday: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      shiftId: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
    },
    { timestamps: false }
  )
}