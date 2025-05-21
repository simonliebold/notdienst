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
      short: {
        type: Sequelize.VIRTUAL,
        get() {
          return this.id
        },
      },
      title: {
        type: Sequelize.VIRTUAL,
        get() {
          return "Dienst: " + new Date(this.start).toLocaleString("de-DE")
        },
      },
      start: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      end: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      rruleId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: sequelize.models.Rrule,
          key: "id",
        },
      },
      scheduleId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: sequelize.models.Schedule,
          key: "id",
        },
      },
    },
    { timestamps: false }
  )
}
