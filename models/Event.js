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
        allowNull: false,
      },
      requiredEmployees: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 1
      },
      dateStart: {
        type: Sequelize.DATEONLY,
        allowNull: true,
      },
      dateEnd: {
        type: Sequelize.DATEONLY,
        allowNull: true,
      },
      timeStart: {
        type: Sequelize.TIME,
        allowNull: false,
      },
      duration: {
        type: Sequelize.INTEGER,
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