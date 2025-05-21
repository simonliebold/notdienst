const { Sequelize } = require("sequelize")

module.exports = (sequelize) => {
  return sequelize.define("event", {
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
    dateStart: {
      type: Sequelize.DATEONLY,
      allowNull: false,
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
  })
}
