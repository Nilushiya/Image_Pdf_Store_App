const User = require('../model/User')
const bcrypt = require('bcrypt');
const secret_key = 'sdfghgfdasdfghjhtrewqwertyuytrewqaxcvbhuytrewsxcvhytrewasxcvghytrewsxcvbhytrewsxcvghytrewazxcvgtrewazxcvghytrewasxcg'

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
        const token = jwt.sign({"id":_id , "user_name":user_name}, secret_key , { expiresIn: '24h' })
        return res.status(201).json({
            jwtToken:token,
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


exports.userSignin = async(req ,res) => {
    const { email ,password } = req.body;
    try{
        const existUser =await User.findOne({email})
        if(existUser.length === 0){
            return res.status(404).json({message : "User not found" , success: false })
        }
        else{
            const passwordMatch = await bcrypt.compare(password, existUser.password)
          
            if(passwordMatch && existUser.active){
                const token = jwt.sign({"id":_id , "user_name":user_name},secret_key,{ expiresIn: '24h' })
                return res.status(200).json({
                    jwtToken:token,
                    message:"User Login successfully.",
                    success:true
                })
            }
            else{
                return res.status(404).json({
                    message:"Invalid credentials",
                    success:false
                })
            }
        }
    }
    catch(err){
        res.status(500).json({
            message: 'Signin failed. Please try again.',
            success:false
        })
    }
}