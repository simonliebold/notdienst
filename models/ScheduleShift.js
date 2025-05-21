const { Sequelize } = require("sequelize")

module.exports = (sequelize) => {
  return sequelize.define("schedules_shifts", {
    scheduleId: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      allowNull: false,
      references: {
        model: sequelize.models.Schedule,
        key: 'id'
      },
    },
    shiftId: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      allowNull: false,
      references: {
        model: sequelize.models.Shift,
        key: 'id'
      },
    },
  })
}
