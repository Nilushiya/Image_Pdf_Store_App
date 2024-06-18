const express = require('express');
const router = express.Router();
// const router = require('express').Router();
const userController = require('../controller/userController');


router.post('/signup' , userController.userSignup)
router.post('/signin' , userController.userSignin)


module.exports = router;