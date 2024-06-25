const db = require('../config/db')
const mongoose = require('mongoose')

const PhotoSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', 
        required: true
    },
    photoUrl: {
        type: String,
        required: true
    },
    folderName: {
        type: String,
        required: true
    },
    likeStatus: {
        type: String,
        default: 'unlike'
    },
    uploadDate: {
        type: Date,
        default: Date.now
    },
    imageSize: {
        type: String, 
        required: true
    }
})

module.exports = mongoose.Model('Photo' , PhotoSchema)