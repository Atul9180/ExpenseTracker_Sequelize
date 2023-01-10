const jwt = require('jsonwebtoken')
const User = require('../model/usersModel')
require('dotenv').config();



//@type: middleware for user authentication
//@description: used to decrypt token value and store userid in global variable 'req' to pass to controller
const authenticate =async (req,res,next)=>{
    try{
        const token = req.headers.authorization;
        if(!token) { return res.status(401).json({ message: 'Unauthorized. No token provided.' }); }
        const user = jwt.verify(token,'587789180#%^#%#vf77') //replace with process.env
        //console.log("user token>>> ",user.userId)
        const result =await User.findByPk(user.userId)
        if(result){
            //console.log(JSON.stringify(result))
            req.user=user;
            next();
        }
        else{
            return res.json({success:false, message: `user does not exists`});
        }
    }
    catch(err){
        return res.status(401).json({success:false,message:"authentication failed"})
    }
}

module.exports ={authenticate}