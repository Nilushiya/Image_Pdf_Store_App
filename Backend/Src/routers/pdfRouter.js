const express = require('express')
const router = express.Router()
const PdfController = require('../controller/pdfController')
const {VerifyToken, verifyToken} = require('../middlewares/authmiddleware')
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: path.join('StorePdf'),
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}${path.extname(file.originalname)}`);
    },
    limits: {
        // fileSize: 1024 * 1024 * 5, 
        files: 10 
    }
});

const upload = multer({ storage: storage });
router.post('/upload', upload.array('pdfs', 10) ,verifyToken , PdfController.uploadPdf)
router.get('/get' , verifyToken , PdfController.getPdfDetails)
router.get('/getByFolder/:folderName' , verifyToken , PdfController.getByFolder)
router.get('/getFolders' , verifyToken , PdfController.getFolders)
router.put('/changeLikeStatus/:pfdID' , PdfController.changeLikeStatus)
router.put('/updateDeleteStatus/:pfdID' , PdfController.changeDeleteStatus)
router.delete('/delete/:pfdID' , PdfController.deletePdfDetails)

module.exports = router