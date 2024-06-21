const express = require('express');
const router = express.Router();
// const router = require('express').Router();
const userController = require('../controller/userController');
const { verifyToken } = require('../middlewares/authmiddleware');


router.post('/signup' , userController.userSignup)
router.post('/signin' , userController.userSignin)
router.post('/request-password-reset',userController.userRestPassword)
router.post('/reset-password',userController.reset)
router.get('/getUser', verifyToken ,userController.getUser);
router.put('/edituser', verifyToken ,userController.editUser);

module.exports = router;