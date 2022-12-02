const { DataTypes } = require("sequelize")
const connection = require("../database/connection")

const Tag = connection.define("tags", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    title: {
        type: DataTypes.STRING(150),
        allowNull: false
    },
}, {
    timestamps: false
})


module.exports = Tag