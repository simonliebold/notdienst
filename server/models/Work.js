const { Sequelize } = require("sequelize")

// TODO: turn duration into function
module.exports = (sequelize) => {
  return sequelize.define(
    "work",
    {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      start: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      end: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      duration: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      scheduleId: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      eventId: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
    },
    { timestamps: false }
  )
}
