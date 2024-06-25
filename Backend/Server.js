const express = require('express');
const body_parser = require('body-parser');
const cors = require('cors');
const path = require('path');
const userRouter = require('./Src/routers/userRouter') 
const photoRouter = require('./Src/routers/photoRouter')
const db = require('./Src/config/db');
const Server = express();

Server.use(cors());
Server.use(express.json());
Server.use(body_parser.json());
Server.use('/api/user',userRouter);
Server.use('/api/photo', photoRouter);
Server.use('/uploads', express.static(path.join(__dirname, '/uploads')));
Server.use('/StoreImage' , express.static(path.join(__dirname, '/StoreImage')))

db();

const PORT =  4000
Server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})

module.exports = Server;

