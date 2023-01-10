const UserModel = require("../model/usersModel");
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
require('dotenv').config();

//secret key
const secretKey = '587789180#%^#%#vf77';  //replace wity .env and line 35


//Signup Page Controller
exports.createNewUserController = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are mandatory" });
    } else {
      const hashedPswd = await bcrypt.hash(password, 10);
      await UserModel.create({
        name,
        email,
        password: hashedPswd,
      });
      return res.status(201).json({ UserAddedResponse: "Successfuly created new user.!" });
    }
  } catch (err) {
    if (err.name === "SequelizeUniqueConstraintError") {
      return res.status(409).json({message:"Email id already exists. Please Login or change the Email id."});
    }
    return res.status(500).json({ message: err });
  }
};


//function generateAccessToken ...has(payload,secretkey) encrypt payload using secret key
function generateAccessToken(id,name){
  return jwt.sign({userId:id, name:name},'587789180#%^#%#vf77')
}

//Login Page Controller
exports.authenticateUserController = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "All fields are mandatory" });
    }

    const user = await UserModel.findOne({ where: { email } });
    if (user) {
      await bcrypt.compare(password, user.password, (hasherr, hashresponse) => {
        if(hasherr){
          throw new Error("Something went wrong in authentication");
        }
        if (hashresponse == true) {
          // Generate JWT
          //const token = jwt.sign({ user.id }, secretKey);
          // Send JWT to client
          return res.status(200).json({ success:true,message: "User logged in successfully", token: generateAccessToken(user.id,user.name) });
          //return res.status(200).json({ user, message: "User Logged in successfully" });
        } 
        else if(hashresponse == false) {
          return res.status(401).json({ message: "User not authorized. Password Incorrect." });
        }
      });
    } else {
      return res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    return res.status(500).json({ error });
  }
};
