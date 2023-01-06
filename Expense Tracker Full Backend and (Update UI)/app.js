const express = require('express')
const app = express()
var cors = require('cors')
const bodyParser =require('body-parser')
const sequelize = require('./utils/database')
const path = require('path')


//middlewares
app.use(cors())
app.use(express.json())
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));


//importing routes
const adminRoute = require('./routes/adminRoutes');
const userRoute = require('./routes/userRoutes');

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/view/signup.html'));
  });
  


//registering routes to app
app.use(adminRoute); 
app.use(userRoute); 


sequelize.sync()
    .then(res=>{ app.listen(4000)})
    .catch(err=>console.log(err))








    //TEST PURPOSE

// sequelize
//   .sync() 
//     .then(result=>{  
//         return ExpenseTrackerModel.findByPk(1)  
//     })
//     .then(expense=>{
//         if(!user){
//            return ExpenseTrackerModel.create({amount:'11111',description:'atul@gmail.com',category:'Fuel'});
//         }
//         return expense;
//     })
//     .then(expense=>{
//         console.log(expense)
//         app.listen(4000)
//     })
//     .catch(err=>console.log(err))