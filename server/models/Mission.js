const { Sequelize } = require("sequelize")

module.exports = (sequelize) => {
  return sequelize.define(
    "mission",
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
          return this.id
        },
      },
      title: {
        type: Sequelize.STRING,
      },
      km: {
        type: Sequelize.INTEGER,
      },
      time: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      workId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: sequelize.models.Work,
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
    { timestamps: true }
  )
}
