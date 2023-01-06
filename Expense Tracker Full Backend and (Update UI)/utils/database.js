const Sequelize = require('sequelize')

const sequelize = new Sequelize('expense-tracker','root','atul123',{
    dialect: 'mysql',
    logging: true,     //to end query logging in console
    host:'localhost'
});      

module.exports = sequelize;