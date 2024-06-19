const User = require('../model/User')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const secret_key = 'sdfghgfdasdfghjhtrewqwertyuytrewqaxcvbhuytrewsxcvhytrewasxcvghytrewsxcvbhytrewsxcvghytrewazxcvgtrewazxcvghytrewasxcg'


exports.userSignup = async (req, res) => {
    const { user_name, user_address, phone_no, email, password } = req.body;

    try {
        const exist_user = await User.findOne({ email });
        if (exist_user) {
            return res.status(400).json({
                message: 'Email already registered.',
                success: false
            });
        } else {
            const hashedPassword = await bcrypt.hash(password, 10);
            const newUser = new User({
                user_name,
                user_address,
                phone_no,
                email,
                password: hashedPassword
            });
            await newUser.save();

            const token = jwt.sign({ id: newUser._id, user_name: newUser.user_name }, secret_key, { expiresIn: '24h' });
            console.log("token : ", token);
            return res.status(201).json({
                jwtToken: token,
                message: "User registered successfully.",
                success: true
            });
        }
    } catch (err) {
        res.status(500).json({
            message: 'Server error.',
            success: false
        });
    }
};


 


exports.userSignin = async(req ,res) => {
    console.log(req.body);
    const { email ,password } = req.body;
    try{
        const existUser =await User.findOne({email})
        console.log("existUser",password)
        if(!existUser){
            console.log("if")
            return res.status(404).json({message : "User not found" , success: false })
            
        }
        else{
            const passwordMatch = await bcrypt.compare(password, existUser.password)

            if(passwordMatch && existUser.active){

                
                const token = jwt.sign({"id":existUser._id , "user_name":existUser.user_name},secret_key,{ expiresIn: '24h' })
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
        console.log("catch")
        res.status(500).json({
            message: 'Signin failed. Please try again.',
            success:false
        })
    }
}