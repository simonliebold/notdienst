const { Sequelize } = require("sequelize")

module.exports = (sequelize) => {
  return sequelize.define(
    "schedules_employees",
    {
      scheduleId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false,
        references: {
          model: sequelize.models.Schedule,
          key: "id",
        },
      },
      employeeId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false,
        references: {
          model: sequelize.models.Employee,
          key: "id",
        },
      },
    },
    { timestamps: false }
  )
}
