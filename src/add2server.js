// temporary holding place for code to add to server during pair programming to connect to MongoDB

'use strict'

require('dotenv').config();
const express = require('express');
const cors = require('cors'); //  I don't remember what this does we may not need it!

const getCaptains = require('./modules/handlers'); // ack my memory!
const app = express();
app.use(cors());

const PORT = process.env.PORT || 3000;

const mongoose = require('mongoose');
mongoose.connect(process.env.MONGODB_CONNECT);

const db = mongoose.connection;
db.on('error', console.error.bind(conssole, 'connection error:'));

db.once('open', function () {
  console.log('Mongoose is connected to Atlas!!')
});

