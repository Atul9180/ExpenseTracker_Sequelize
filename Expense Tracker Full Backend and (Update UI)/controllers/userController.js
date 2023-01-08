const UserModel = require("../model/usersModel");
const bcrypt = require("bcrypt");

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
          return res.status(200).json({ user, message: "User Logged in successfully" });
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
