const db = require('../config/db')
const mongoose = require('mongoose')

const PdfSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', 
        required: true
    },
    pdfUrl: {
        type: String,
        required: true
    },
    folderName: {
        type: String,
        required: true , 
        lowercase : true
    },
    likeStatus: {
        type: String,
        default: 'unlike'
    },
    DeleteStatus: {
        type: String,
        default: 'not in bin'
    },
    uploadDate: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model('Pdf' , PdfSchema)