const ExpenseTrackerModel = require('../model/expensesModel')
 

//get all expenses
exports.getAllExpenses = async (req,res)=>{
    try{
        const allExpenses = await ExpenseTrackerModel.findAll();
        res.status(200).json({allExpenses : allExpenses})
    }catch(err){
        console.log('Error in fetching all expenses record with error: ',JSON.stringify(err))
        res.status(500).json({error: err})
    } 
}


//getExpenseById
exports.getExpenseById = async (req,res)=>{
    try{
        const uid = req.params.id;
        if(!uid){
            console.log('User Id of updated user expense is missing')
            return res.status(400).json({error: 'Expense Id of Updated user missing'})
        }
        const expenseById = await ExpenseTrackerModel.findByPk(uid)
        res.status(200).json({updatedUserExpense : expenseById})
    }catch(err){
        console.log('Error in fetching expense by Id record with error: ',JSON.stringify(err))
        res.status(500).json({error: err})
    }  
}


//addNew Expense Post Request
exports.addNewExpense = async (req,res)=>{
    try{
        const {amount ,description, category} = req.body;       
        if(!amount || !description || !category){ throw new Error('all fields mandatory')}
        const newExpense = await ExpenseTrackerModel.create({
            amount ,description, category         
        }) 
        res.status(201).json({newAddedExpense:newExpense})
    }
    catch(err){
        console.log('Error in posting new expense record with error: ',JSON.stringify(err))
        res.status(500).json({error: err})
    } 
}


//delete Expense
exports.deleteExpense = async (req,res)=>{
    try{
        const uid =req.params.id;
        if(!uid){ 
            console.log('Delete Id of deleting expense missing ')
            return res.status(400).json({error:'Delete Id is missing while deleting.'})
        }
        const delres = await ExpenseTrackerModel.destroy({ where: {id:uid}})
            res.sendStatus(200)
    }
    catch(err){
        console.log('Error in deleting expense by Id record with error: ',JSON.stringify(err))
        res.status(500).json({error: err})
    } 
}


//update expense
exports.updateExpense = async (req,res)=>{
    try{
        const {amount ,description, category} = req.body;
        const uid = req.params.id;
        if(!uid){ return res.status(422).json({error: 'Id to be updated is incorrect so, it cannot be updated'})}
        if(!amount || !description || !category){ throw new Error('all fields mandatory')}
        const result = await ExpenseTrackerModel.update({ amount ,description, category },
                          { returning:true, where: {id:uid} })
        res.sendStatus(200)         
    }
    catch(err){
        console.log('Error in updating expense record by Id with error: ',JSON.stringify(err))
        res.status(500).json({error: err})
    } 
}