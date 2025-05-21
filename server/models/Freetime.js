const { Sequelize } = require("sequelize")

module.exports = (sequelize) => {
  return sequelize.define(
    "freetime",
    {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      short: {
        type: Sequelize.VIRTUAL,
        get() {
          return this.type
        },
      },
      title: {
        type: Sequelize.VIRTUAL,
        get() {
          return "Dienstplanwunsch"
        },
      },
      type: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: "X",
      },
      date: {
        type: Sequelize.DATEONLY,
        allowNull: false,
      },
      scheduleId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: sequelize.models.Schedule,
          key: "id",
        },
      },
      employeeId: {
        type: Sequelize.INTEGER,
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
