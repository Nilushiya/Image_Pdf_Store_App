const User = require('../model/User')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const secret_key = 'sdfghgfdasdfghjhtrewqwertyuytrewqaxcvbhuytrewsxcvhytrewasxcvghytrewsxcvbhytrewsxcvghytrewazxcvgtrewazxcvghytrewasxcg'
const crypto = require('crypto');
const nodemailer = require('nodemailer');

exports.userSignup = async (req, res) => {
    const { user_name, user_address, phone_no, email, password } = req.body;
    // console.log("body",req.body)
    try {
        const exist_user = await User.findOne({ email });
        if (exist_user) {
            return res.json({
                error: 'Email already registered.',
                success: false
            });
        }
        else {
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
            return res.json({
                jwtToken: token,
                message: "User registered successfully.",
                success: true
            });
        }
    } catch (err) {
        res.status(500).json({
            error: err.message,
            success: false
        });
    }
};


 


exports.userSignin = async(req ,res) => {
    // console.log(req.body);
    const { email ,password } = req.body;
    try{
      const lowercaseEmail = email.toLowerCase();
        const existUser =await User.findOne({lowercaseEmail})
        if(!existUser){
            return res.json({error : "User not found" , success: false })
            
        }
        else{
            const passwordMatch = await bcrypt.compare(password, existUser.password)

            if(passwordMatch && existUser.active){

                
                const token = jwt.sign({"id":existUser._id , "user_name":existUser.user_name},secret_key,{ expiresIn: '24h' })
                return res.json({
                    jwtToken:token,
                    message:"User Login successfully.",
                    success:true
                })
            }
            else{
                return res.json({
                    error:"Invalid credentials",
                    success:false
                })
            }
        }
    }
    catch(err){
        res.status(500).json({
            error: 'Signin failed. Please try again.',
            success:false
        })
    }
}

exports.userRestPassword = async (req, res) => {
    const { email } = req.body;
    console.log('email', req.body);
    const lowercaseEmail = email.toLowerCase();
  
    try {
      const user = await User.findOne({ lowercaseEmail });
  
      if (!user) {
        return res.json({
          success: false,
          error: 'User not found'
        });
      }
  
      const token = crypto.randomBytes(32).toString('hex');
      user.resetToken = token;
      user.resetTokenExpiry = Date.now() +  3600000; // 1 Hour
      await user.save();
      
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        port : 587 , 
        logger: true,
        debug : true,
        secureConnection : false ,
        auth: {
          user: 'nilushiyak@gmail.com',
          pass: 'zlpivdtemnrfcyyr'
        },
        tls : {
            rejectUnauthorized : true
            }
      });
      console.log("token : ",token)
      const link = `http://localhost:3000/resetPassword/${token}`
      console.log("link : ",link)
      const mailOptions = {
        from: 'nilushiyak@gmail.com',
        to: user.email,
        subject: 'Password Reset',
        text: `You requested for password reset. Click this link to reset your password: http://localhost:3000/resetPassword/${token}`
      };

      
      
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          return res.json({ 
            success: false, 
            error: 'Failed to send email',
            details : error.message
        });
        }
        res.json({ success: true, message: 'Password reset link sent to email' });
      });
    } catch (err) {
      console.error('Error in password reset:', err);
      res.status(500).json({ success: false, error: 'Server error' });
    }
  }
  


 exports.reset = async (req, res) => {
    const { token, password } = req.body;
    try {
      const user = await User.findOne({
        resetToken: token,
        resetTokenExpiry: { $gt: Date.now() }
      });
      if (!user) {
        return res.json({ success: false, error: 'Invalid or expired token' });
      }
  
      user.password = password;
      user.resetToken = undefined;
      user.resetTokenExpiry = undefined;
      await user.save();
  
      res.json({ success: true, message: 'Password reset successful' });
    } catch (err) {
      res.status(500).json({ success: false, error: 'Server error' });
    }
  };
  
//   vthenujan7400@gmail.com