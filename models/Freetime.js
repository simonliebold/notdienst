const { Sequelize } = require("sequelize")

module.exports = (sequelize) => {
  return sequelize.define("freetime", {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    start: {
      type: Sequelize.DATEONLY,
      allowNull: false,
    },
    end: {
      type: Sequelize.DATEONLY,
      allowNull: false,
    },
    scheduleId: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    employeeId: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
  })
}
