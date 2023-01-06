const UserModel = require('../model/usersModel')

exports.createNewUserController = async (req,res)=>{
    try{
        const {name ,email, password} = req.body; 
        if(!name || !email || !password){ return res.status(400).json({error: 'all fields are mandatory'})}
        await UserModel.create({
            name ,email, password
        })
        res.status(201).json({UserAddedResponse:'Successfuly created new user.!'})
    }
    catch(err){
        //console.log(err);
        // if(err.name === 'SequelizeUniqueConstraintError'){
        // return res.status(409).json({error: "User already exists"});
        // }        
        return res.status(500).json({error: "Server Error creating user"});
        
    }
}