const Sequelize = require('sequelize')

const sequelize = new Sequelize(process.env.DB_DATABASE,process.env.DB_USERNAME,process.env.DB_PASSWORD,{
    dialect: 'mysql',
    logging: false,     //to end query logging in console
    host:process.env.DB_HOST
});      

module.exports = sequelize;