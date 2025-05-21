const { Sequelize } = require("sequelize")

module.exports = (sequelize) => {
  return sequelize.define(
    "jobs_employees",
    {
      jobId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false,
        references: {
          model: sequelize.models.Job,
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
