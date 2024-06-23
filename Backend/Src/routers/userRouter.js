const express = require('express');
const router = express.Router();
// const router = require('express').Router();
const userController = require('../controller/userController');
const { verifyToken } = require('../middlewares/authmiddleware');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: path.join('uploads'),
    // destination : function(req, file, cb){
    //     cb(null, "uploads/")
    // },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}${path.extname(file.originalname)}`);
    }
});

const upload = multer({ storage: storage });

router.post('/uploads', upload.single('profile_image'), verifyToken ,userController.uploadProfileImage);
router.delete('/deleteProfile', verifyToken, userController.removeProfileImage);
router.post('/signup' , userController.userSignup)
router.post('/signin' , userController.userSignin)
router.post('/request-password-reset',userController.userRestPassword)
router.post('/reset-password',userController.reset)
router.get('/getUser', verifyToken ,userController.getUser);
router.put('/edituser', verifyToken ,userController.editUser);
router.put('/deleteUser', verifyToken ,userController.deleteUser);


module.exports = router;