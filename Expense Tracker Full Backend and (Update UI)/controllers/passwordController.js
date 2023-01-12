const User = require('../model/usersModel')


exports.forgotPassword = async (req,res)=>{
    try{
        const email = req.body.email;
        const user = await User.findOne({where : { email }});
        console.log(user);
        if(user){

        }
        else{
            return res.status(400).json({message:"Entered Email Id does not exists. Please enter correct emailId..! "})
        }
    }
    catch(err){
        console.log("Error in forgot passwordForm:  ",err)
        throw new Error(err)
    }
}