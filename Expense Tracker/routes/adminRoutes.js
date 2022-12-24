const express = require('express')
const router = express.Router();

const adminControllers = require('../controllers/adminController')


router.get('/admin/getAllExpenses',adminControllers.getAllExpenses)

router.get('/admin/getExpenseById/:id',adminControllers.getExpenseById)

router.post('/admin/addNewExpense',adminControllers.addNewExpense)

router.put('/admin/updateExpense/:id',adminControllers.updateExpense)

router.delete('/admin/deleteExpense/:id',adminControllers.deleteExpense)



module.exports = router;