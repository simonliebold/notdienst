const { Sequelize } = require("sequelize")

module.exports = (sequelize) => {
  return sequelize.define(
    "employment",
    {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      short: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: false,
        set(value) {
          this.setDataValue("short", value.toUpperCase())
        },
        validate: {
          len: {
            args: [1, 10],
            msg: "Das Kürzel muss zwischen 1 und 10 Zeichen lang sein",
          },
        },
      },
      title: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
        validate: {
          notEmpty: {
            args: true,
            msg: "Der Titel darf nicht leer sein",
          },
        },
      },
      minHours: {
        type: Sequelize.INTEGER,
        allowNull: true,
        set(value) {
          if (value == "") this.setDataValue("minHours", null)
          else this.setDataValue("minHours", value)
        },
      },
      maxHours: {
        type: Sequelize.INTEGER,
        allowNull: true,
        set(value) {
          if (value == "" || isNaN(value)) this.setDataValue("maxHours", null)
          else this.setDataValue("maxHours", value)
        },
      },
    },
    { timestamps: false }
  )
}
