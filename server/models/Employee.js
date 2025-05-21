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
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      employmentId: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
    },
    { timestamps: false }
  )
}
