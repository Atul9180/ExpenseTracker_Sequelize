const express = require('express')
const app = express()
require('dotenv').config();
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


//registering routes to app
app.use(adminRoute); 

app.get('/',(req,res)=>{
    res.sendFile(path.join(__dirname,'public/view/home.html'))
})


sequelize.sync()
    .then(res=>{ app.listen(4000)})
    .catch(err=>console.log(err))

