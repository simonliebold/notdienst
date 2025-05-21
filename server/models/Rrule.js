const { Sequelize } = require("sequelize")

module.exports = (sequelize) => {
  return sequelize.define(
    "rrule",
    {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      shiftId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: sequelize.models.Shift,
          key: "id",
        },
      },
    },
    { timestamps: false }
  )
}
