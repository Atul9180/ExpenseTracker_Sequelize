const Sequelize = require('sequelize');
const sequelize =require('../utils/database')

const ForgotPasswod = sequelize.define('forgotpassword_tb', {
    id:{
        type: Sequelize.UUID,
        allowNull: false,
        primaryKey: true
    },
    active: Sequelize.BOOLEAN,
    expiresby: Sequelize.DATE    
});

module.exports = ForgotPasswod;

