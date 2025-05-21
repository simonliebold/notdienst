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
          return this.id
        },
      },
      title: {
        type: Sequelize.VIRTUAL,
        get() {
          return (
            this.type + " am " + new Date(this.start).toLocaleDateString("de-DE")
          )
        },
      },
      type: {
        type: Sequelize.ENUM(
          "Wunschfrei",
          "Nicht Tag",
          "Nicht Nacht",
          "Urlaub",
          "Seminar",
          "Ausbildung"
        ),
        allowNull: false,
        defaultValue: "Wunschfrei",
      },
      start: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      end: {
        type: Sequelize.DATE,
        allowNull: false,
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
