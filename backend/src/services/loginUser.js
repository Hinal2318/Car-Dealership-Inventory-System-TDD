const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const JWT_SECRET = process.env.JWT_SECRET || 'test_secret';

const loginUser=async({email,password})=>{

    //validate feilds are present
    if(!email || !password)
    {throw new Error('Email and password are required');}

    const normalizeEmail=email.toLowerCase().trim();

    //find user by email
    const user=await User.findOne({email:normalizeEmail});
    if(!user){
        throw new Error('Invalid email or password');
    }

    //comapre password
   const isMatch=await bcrypt.compare(password,user.password);
   if(!isMatch)
    {
        throw new Error('Invalid email or password');
    } 

    //sign and return JWT token
    const token=jwt.sign(
        {
            userId:user._id,role:user.role
        }, JWT_SECRET, {expiresIn:'1d'}
    );
    return token;
};
module.exports=loginUser;