
const Expenses = require('../model/expensesModel');
const User = require('../model/usersModel');
const Sequelize = require('sequelize')




exports.getLeadersData = async(req,res)=>{
    try{
        const leadersExpenses = await Expenses.findAll({
            include: [{
              model: User,
              attributes: ['name']
            }],
            attributes: [
              'usersTbId',
              [Sequelize.fn('SUM', Sequelize.col('amount')), 'aggregated_sum'],
            ],
            group: ['usersTbId'],
            order: [['aggregated_sum', 'DESC']],
           
          });
          res.json(leadersExpenses);

    }catch(err){
        console.log('Error in fetching leaders data, error: ',JSON.stringify(err))
        res.status(500).json(err.message)
    }
}