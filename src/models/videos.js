const { DataTypes } = require("sequelize")
const connection = require("../database/connection")
const Tag = require("./tags")
const User = require("./users")

const Video = connection.define("videos", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    fk_tag_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: Tag,
            key: "id"
        }
    },
    fk_user_id: { // TODO: testar
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Tag,
            key: "id"
        }
    },
    title: {
        type: DataTypes.STRING(150),
        allowNull: false
    },
    description: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    url: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
}, {
    timestamps: false
})

Tag.hasMany(Video, {as: "videos", foreignKey: "fk_tag_id"})
Video.belongsTo(Tag, {as: "tag", foreignKey: "fk_tag_id"})

User.hasMany(Video, {as: "videos", foreignKey: "fk_user_id"})
Video.belongsTo(User, {as: "user", foreignKey: "fk_user_id"})

module.exports = Video