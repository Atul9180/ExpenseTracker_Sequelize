const Razorpay = require('razorpay');
const Order = require('../model/ordersModel');
const User = require('../model/usersModel');
const userController = require('../controllers/userController')

exports.purchasePremium = async (req, res) => {
    try {
        const instance = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID,
            key_secret: process.env.RAZORPAY_KEY_SECRET
        });
        const amount = 10000;
        const order = await instance.orders.create({ amount, currency: 'INR' });

        await Order.create({
            usersTbId: req.user.userId,
            orderid: order.id,
            amount: order.amount,
            currency: order.currency,
            status: 'PENDING',
            orderDate: order.created_at
        });
        return res.status(201).json({success:true, order, key_id: instance.key_id });
    } catch (err) {
        console.error(err);
        return res.status(403).json({ message: 'Something went wrong', error: err });
    }
};



exports.updateTransactionStatus = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { order_id, payment_id } = req.body;
        const order = await Order.findOne({ where: { orderid: order_id } });        
        await Promise.all([
            order.update({ paymentid: payment_id, status: 'SUCCESSFUL' }),
            User.update({ ispremiumuser: true }, { where: { id: req.user.userId } })
        ]);
        return res.status(202).json({ success: true, message: 'Transaction Successful.!', token: userController.generateAccessToken(userId,undefined,true) });
    } catch (error) {
        //await Order.update({ status: 'FAILED', paymentid: payment_id }, { where: { orderid: order_id } });
        console.error(error);
        return res.status(403).json({ error, message: 'Transaction Failed. Please try again' });
    }
};
