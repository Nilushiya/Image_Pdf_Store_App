const express = require('express')
const router = express.Router()
const PhotoController = require('../controller/photoController')
const {VerifyToken, verifyToken} = require('../middlewares/authmiddleware')
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: path.join('StoreImage'),
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}${path.extname(file.originalname)}`);
    },
    limits: {
        // fileSize: 1024 * 1024 * 5, 
        files: 10 
    }
});

const upload = multer({ storage: storage });
router.post('/upload', upload.array('images', 10) ,verifyToken , PhotoController.uploadImage)

module.exports = router