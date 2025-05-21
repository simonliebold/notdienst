const { Sequelize } = require("sequelize")

module.exports = (sequelize) => {
  return sequelize.define(
    "employee",
    {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      initials: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: false,
        set(value) {
          this.setDataValue("initials", value.toUpperCase())
        },
        validate: {
          notEmpty: {
            args: true,
            msg: "Das Kürzel darf nicht leer sein",
          },
        },
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
          notEmpty: {
            args: true,
            msg: "Der Name darf nicht leer sein",
          },
        },
      },
      employmentId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: sequelize.models.Employment,
          key: "id",
        },
      },
    },
    { timestamps: false }
  )
}
