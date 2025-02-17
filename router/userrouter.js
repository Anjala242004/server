const express = require('express');
const {loginUser,registerUser}=require('../control/usercontrol')

const user = express.Router();

user.post("/register",registerUser)
user.post("/login",loginUser)

module.exports=user