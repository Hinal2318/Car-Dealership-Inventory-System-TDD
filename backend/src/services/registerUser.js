const bcrypt=require('bcryptjs');
const User=require("../../src/models/User.js");

const registerUser=async(userData)=>{
    const {email,password,role}=userData;

    //Throw error if feild are missing
    if(!email || !password){
        throw new Error('Email and password are required');
    }

    const normalizeEmail=email.toLowerCase().trim();

    //check existing user by email
    const existingUser=await User.findOne({
        email:normalizeEmail
    });
    if(existingUser)
    {throw new Error('user already exists');}


    const hashedPassword=await bcrypt.hash(password,10);

    //create new User
    const newUser=await User.create({
        email:normalizeEmail,
        password:hashedPassword,
        ...(role && ['user','admin'].includes(role) ? { role } : {}),
    })
    return newUser;
}
module.exports=registerUser;