const { Sequelize } = require("sequelize")

module.exports = (sequelize) => {
  return sequelize.define(
    "works_employees",
    {
      workId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false,
        references: {
          model: sequelize.models.Work,
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
