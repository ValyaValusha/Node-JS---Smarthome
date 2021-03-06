const express = require('express');
const mongoose = require('mongoose');
const corsMiddleware = require('./middlewares/cors');
const deviceRouter = require('./routes/devices');
const groupRouter = require('./routes/groups');
const app  = express();

mongoose.connect('mongodb://localhost:27017/smartHome');

app.use(corsMiddleware);
app.use(express.json());
app.use('/devices', deviceRouter);
app.use('/groups', groupRouter);

app.get('/', (req,res) => {
    res.send( 'It works');
});

app.listen(3010);