const UserModel = require('../model/usersModel')

exports.createNewUserController = async (req,res)=>{
    try{
        const {name ,email, password} = req.body; 
        if(!name || !email || !password){ throw new Error('all fields are mandatory')}
        const newUser = await UserModel.create({
            name ,email, password
        })
        res.status(201).json({UserAddedResponse:newUser})
    }
    catch(err){
        //console.log(`error ${err} in creating new user. caught in line 13 usercontroller`)
        res.status(500).json({error:err})
    }
}