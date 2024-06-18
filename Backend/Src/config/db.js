const mongoose = require('mongoose');

const connection = async() => {
    try{
            await mongoose.connect('mongodb://localhost:27017/Image_Pdf_Store',{
            useNewUrlParser: true,
            useUnifiedTopology: true
    });
    console.log('MongoDB connected');
    }
    catch(err){
        console.log('MongoDB connection error:', err);
    }
}

module.exports = connection;