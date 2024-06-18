const User = require('../model/User')
const bcrypt = require('bcrypt');

exports.userSignup = async(req,res) => {
    console.log("HI")
    console.log(res.body)
    const {user_name , user_address , phone_no, email , password} = req.body;
    
   
   try{
    const exist_user = await User.findOne({email});
    if(exist_user){
        return res.status(400).json({
            message: 'Email already registered.' ,
            success:false
        })
    }
    else{
        const hashedPassword =await bcrypt.hash(password , 10);
        const newUser = new User({
            user_name,
            user_address,
            phone_no,
            email,
            password:hashedPassword
        })
        await newUser.save();
        return res.status(201).json({
            message:"User registered successfully.",
            success:true
        })
    }
   }
   catch(err){
    res.status(500).json({ message: 'Server error.',
        success:false
     });
   }

}   