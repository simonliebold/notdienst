const { Sequelize } = require("sequelize")

module.exports = (sequelize) => {
  return sequelize.define("jobs_shifts", {
    jobId: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      allowNull: false,
      references: {
        model: sequelize.models.Job,
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
