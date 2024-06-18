const express = require('express');
const body_parser = require('body-parser');
const cors = require('cors');
const path = require('path');
const userRouter = require('./Src/routers/userRouter') 

const Server =express();

Server.use(cors());
Server.use(express.json());
Server.use(body_parser.json);
Server.use('/api/user',userRouter);


const PORT = process.env.PORT || 4000
Server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})

module.exports = Server;

