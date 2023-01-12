const express = require('express')
const router = express.Router();

const userControllers = require('../controllers/userController')
const passwordController = require('../controllers/passwordController')

router.post("/user/signup",userControllers.createNewUserController);

router.post("/user/login",userControllers.authenticateUserController);

router.post("/password/forgotPassword",passwordController.forgotPassword)

module.exports = router;