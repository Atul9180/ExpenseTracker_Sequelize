const Expense = require("../model/expensesModel");
const User = require("../model/usersModel");
const sequelize = require("sequelize");

exports.getLeadersData = async (req, res) => {
  try {
    const leadersExpenses = await User.findAll({
      attributes: [
        "name",
        [
          sequelize.fn(
            "coalesce",
            sequelize.fn("SUM", sequelize.col("user_expenses_tbs.amount")),
            0
          ),
          "aggregate_amount",
        ],
      ],
      include: [
        {
          model: Expense,
          attributes: [],
          required: false,
        },
      ],
      group: ["users_tb.id"],
      order: [[sequelize.literal("aggregate_amount"), "DESC"]],
    });
    res.json(leadersExpenses);
  } catch (err) {
    console.log("Error in fetching leaders data, error: ", JSON.stringify(err));
    res.status(500).json(err.message);
  }
};



// exports.getLeadersData = async(req,res)=>{
//     try{
//         const leadersExpenses = await Expense.findAll({
//             include: [{
//               model: User,
//               attributes: ['name']
//             }],
//             attributes: [
//               'usersTbId',
//               [sequelize.fn('SUM', sequelize.col('amount')), 'aggregate_amount'],
//             ],
//             group: ['usersTbId'],
//             order: [['aggregate_amount', 'DESC']],

//           });
//           res.json(leadersExpenses);

//     }catch(err){
//         console.log('Error in fetching leaders data, error: ',JSON.stringify(err))
//         res.status(500).json(err.message)
//     }
// }
