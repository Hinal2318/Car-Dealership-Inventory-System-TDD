const registerUser = require('../services/registerUser');
const loginUser = require('../services/loginUser');

const authController={
    //register user
    register: async(req,res)=>{
        try{
            const {email,password}=req.body;
            const user=await registerUser({email,password});

            return res.status(201).json({
                message:'User registered sucessfully',
                user:{
                    id:user._id,
                    email:user.email,
                    role:user.role
                }
            });
        }catch(error){

        const status = error.message.includes('required') || error.message.includes('exists') ? 400 : 500;
         return res.status(status).json({ error: error.message });


        }
    },
    login: async (req, res) => {
    try {
      const { email, password } = req.body;
      const token = await loginUser({ email, password });
      
      return res.status(200).json({
        message: 'Login successful',
        token
      });

    } catch (error) {
      
      let status = 500;
      if (error.message.includes('required')) {
        status = 400;
      } else if (error.message.includes('Invalid')) {
        status = 401;
      }
      return res.status(status).json({ error: error.message });
    }
  }
    
}
module.exports = authController;