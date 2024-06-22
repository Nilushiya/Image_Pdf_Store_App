const User = require('../model/User')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const secret_key = 'sdfghgfdasdfghjhtrewqwertyuytrewqaxcvbhuytrewsxcvhytrewasxcvghytrewsxcvbhytrewsxcvghytrewazxcvgtrewazxcvghytrewasxcg'
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const { param } = require('../routers/userRouter');
 const path = require('path');  
 const fs = require('fs');

 exports.uploadProfileImage = async (req, res) => {
    const id = req.user && req.user.id;
    console.log("id:", id);

    if (!id) {
        return res.status(401).json({
            message: "Error: Missing user ID.",
            success: false
        });
    }

    try {
        const isUser = await User.findById(id);
        console.log("isUser:", isUser);

        if (!isUser) {
            return res.status(404).json({
                message: "User not found",
                success: false
            });
        }

        // Delete old profile image if it exists
        if (isUser.profile_image) {
            const imagePath = path.join(__dirname, `../${isUser.profile_image}`);
            if (fs.existsSync(imagePath)) {
                fs.unlinkSync(imagePath);
                console.log(`Deleted old profile image: ${imagePath}`);
            }
        }

        // Set new profile image URL
        const imageUrl = `http://localhost:4000/uploads/${req.file.filename}`;
        isUser.profile_image = imageUrl;
        await isUser.save();

        res.json({
            success: true,
            message: "Profile image updated successfully",
            profile_image: imageUrl,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ 
            message: 'Internal Server Error',
            success: false
        });
    }};



    exports.removeProfileImage = async (req, res) => {
        const userId = req.user && req.user.id;
    
        if (!userId) {
            return res.status(401).json({
                message: "Error: Missing user ID.",
                success: false
            });
        }
    
        try {
            const user = await User.findById(userId);
            if (!user) {
                return res.json({
                    message: "User not found",
                    success: false
                });
            }
    
            // Check if there's already a profile image, delete it if so
            if (user.profile_image) {
                const imagePath = path.join(__dirname, `../${user.profile_image}`);
                if (fs.existsSync(imagePath)) {
                    fs.unlinkSync(imagePath);
                }
                user.profile_image = null;
                await user.save();
            } else {
                return res.json({
                    message: "No profile image found to delete",
                    success: false
                });
            }
    
            res.json({
                success: true,
                message: "Profile image removed successfully",
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    };
    



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

exports.editUser = async (req, res) => {
  // console.log("Edits: ", req.body);
  const edits = req.body;
  const id = req.user && req.user.id;

  if (!id || !edits) {
      return res.json({
          message: "Error: Missing user ID or request body",
          success: false
      });
  }

  try {
      const user = await User.findByIdAndUpdate(id, { $set: edits }, { new: true, runValidators: true });
      if (!user) {
          return res.json({
              message: 'User not found',
              success: false
          });
      }

      return res.json({
          message: 'User updated successfully',
          success: true,
          user
      });
  } catch (err) {
      console.error("Error updating user details: ", err);
      return res.status(500).json({
          message: "Internal server error",
          success: false
      });
  }
};

exports.getUser = async (req, res) => {
  const id = req.user && req.user.id;

  if (!id) {
      return res.json({
          message: "Error: Missing user ID.",
          success: false
      });
  }

  try {
      const user_details = await User.findById({_id : id}); 
      if (!user_details) {
          return res.json({
              message: "User not found",
              success: false
          });
      }
      console.log("details: ", user_details);
      return res.json({
          message: "User found",
          success: true,
          user: user_details
      });
  } catch (err) {
      console.error("Error fetching user details: ", err);
      return res.status(500).json({
          message: "Internal server error",
          success: false
      });
  }
};

exports.deleteUser = async (req, res) => {
    const id = req.user && req.user.id;
  
    if (!id) {
        return res.json({
            message: "Error: Missing user ID.",
            success: false
        });
    }
  
    try {
        const user_details = await User.findById({_id : id}); 
        if (!user_details) {
            return res.json({
                message: "User not found",
                success: false
            });
        }

        user_details.active = 0 ;
        await user_details.save();
        console.log("details: ", user_details);
        return res.json({
            message: "User deactive",
            success: true,
            user: user_details
        });
    } catch (err) {
        console.error("Error fetching user details: ", err);
        return res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }};


exports.userSignin = async(req ,res) => {
    // console.log(req.body);
    const { email ,password } = req.body;
    try{
        const existUser =await User.findOne({email:email})
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


exports.uploadImage = async(req , res) =>{
    const edits = req.body;
    const id = req.user && req.user.id;
  
    if (!id || !edits) {
        return res.json({
            message: "Error: Missing user ID or request body",
            success: false
        });
    }
}

exports.userRestPassword = async (req, res) => {
    const { email } = req.body;
    // console.log('email', req.body);
  
    try {
      const user = await User.findOne({ email:email });
      // console.log("user : ",user);
      if (!user) {
        return res.json({
          success: false,
          error: 'User not found'
        });
      }

      const token = jwt.sign({ id: user._id, email: user.email  }, secret_key, { expiresIn: '1h' });
      
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
      const decoded = jwt.verify(token, secret_key);
      const user = await User.findById(decoded.id);
      // console.log("user : ",user);
      if (!user) {
        return res.json({ success: false, error: 'Invalid or expired token' });
      }
  
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
  
      user.password = hashedPassword;
      await user.save();
  
      res.json({ success: true, message: 'Password reset successful' });
    } catch (err) {
      res.status(500).json({ success: false, error: 'Server error' });
    }
  };
  
//   vthenujan7400@gmail.com