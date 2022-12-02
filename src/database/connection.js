const Sequelize = require('sequelize')
const sequelize = new Sequelize(
    process.env.DB_NAME || "streaming",
    process.env.DB_USER || "postgres",
    process.env.DB_PWD || "password" ,
    {
        host: process.env.DB_HOST || "localhost",
        dialect: process.env.DB_DIALECT || "postgres",
        logging: process.env.NODE_ENV == "development" ? true : false
    }
)

module.exports = sequelize