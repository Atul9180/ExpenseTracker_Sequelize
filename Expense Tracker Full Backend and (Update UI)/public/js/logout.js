const { json } = require('body-parser');
const Razorpay = require('razorpay')
const Order = require('../model/ordersModel')
const User = require('../model/usersModel')

exports.purchasePremium = async (req, res) => {
    try{
        const instance = new Razorpay({
            // key_id: 'rzp_test_Wqa5kCvCMQUPdj',
            // key_secret: 'kUM1SbehUoYOwefYJYKYGtDX'
            key_id: process.env.RAZORPAY_KEY_ID,
            key_secret: process.env.RAZORPAY_KEY_SECRET
          });
        const amount = 10000;
        //at razorpay create orderid as 'id':'order_L2QEpbf7fxblPy'
        const order = await instance.orders.create({amount,currency: 'INR'});
       //console.log('line 14 after order create premiummember fn>> ',order)
      // console.log("req.user is>> ",req.user) //has userId,name of looged user

        await Order.create({
            usersTbId: req.user.userId,
            orderid: order.id,
            amount: order.amount,
            currency: order.currency,
            status: 'PENDING',
            orderDate: order.created_at
        })
        console.log("purchase controller line 19 order is:>> ",order)
       // console.log("purchase controller line 20 instance.key_id is:>> ",instance.key_id)
            return res.status(201).json({order,key_id:instance.key_id});
        }
        catch(err){
            console.error(err);
           return res.status(403).json({message:'Something went wrong', error:err})
    }
}

exports.updateTransactionStatus = async (req, res) => {
    try{
        const {order_id,payment_id} = req.body;
        const order = await Order.findOne({where:{orderid:order_id}});
        console.log("line42:  ",order)
        const P1 = order.update({paymentid:payment_id, status:'SUCCESSFUL'});
        const P2 =  User.update({ ispremiumuser: true },{ where: { id: req.user.userId } });
        Promise.all([P1,P2]).then(()=>{
            return res.status(202).json({success:true,message:'Transaction Successful.!'});
        })
        .catch((error)=>{
            console.log("Payment failed... ",error)
            throw new Error(error)
        })
        
        }
        catch(error){
            Order.update({status : "failure", paymentid: payment_id}, { where: { orderid: order_id } });
            console.error("line 55 script.js ",error);
            return res.status(403).json({error,message:'Transaction Failed. Please Try again'});
        }    
};


==================================================================ScriptProcessorNode.json



document.getElementById("buyPremiumBtn").addEventListener("click", async function (e) {
    try {
      // Get the token from local storage
      const token = localStorage.getItem('token');
  
      // Make a GET request to the server to create the order and get the payment credentials
      const response =await  axios.get("http://localhost:4000/purchase/premiumMember", { headers: { Authorization: `${token}` } });
  
      // Create the payment handler function
      var paymentcreds ={ 
        "key": response.data.key_id,
              "order_id": response.data.order.id,
              "handler": async function (response){
        try {
          // Make a POST request to update the transaction status
          await axios.post("http://localhost:4000/purchase/updateTransactionStatus", {
            order_id: paymentcreds.order_id,
            payment_id: response.razorpay_payment_id,
          }, { headers: { Authorization: token } });
  
          // Update the UI and show a success message
          document.getElementById("buyPremiumBtn").innerText = "You are a premium member now";
          document.getElementById("buyPremiumBtn").classList.add('disabled');
          alert('Your Premium Membership is now active');
          //window.location.reload(); 
        }
        catch (err) {
          // Handle the error
          console.error(err);
          alert('trans failed line 197 Something went wrong. Please try again.');
          throw new Error(err);
        }
      }
      }
    
      // Create the Razorpay instance and open the payment modal
      const rzpl = new Razorpay(paymentcreds);
      rzpl.open();
      e.preventDefault();
  
      // Add an event listener to handle payment failure
      rzpl.on('payment.failed', async (response) => {
        try{
          console.log("payment failed res on line 210>> ", response.error.description);
          console.log("Order ID: line 210 ", response.error.metadata.order_id);
          console.log("Payment ID: ", response.error.metadata.payment_id);
          const orderId = response.error.metadata.order_id
          const paymentId = response.error.metadata.payment_id
          alert(`Alert: ${response.error.description}`)
          //updating payment status to failure and order_id and payment_id to Order table
          // await Order.update({status : "failure", paymentid: paymentId}, { where: { orderid: orderId } });
          } catch (error) {
              console.log(error)
              alert(`Payment failed due to ${error.error.description}`);
              //window.location.reload();
          }
      });
    } catch (err) {
      // Handle the error
      console.error(err);
      alert('Something went wrong last line. Please try again.');
      throw new Error(err);
    }
  });
