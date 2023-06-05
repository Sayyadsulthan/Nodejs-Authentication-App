const { connect } = require('http2');
const mongoose = require('mongoose');
require('dotenv').config()

mongoose  
    .connect(process.env.DB_URI)
    .then(()=>{console.log("db connected")})
    .catch((err)=>{console.log("db not connected..", err)})

let db = mongoose.connection;

db.on('error', ()=>{console.error.bind(console,'something wrong in connection')})

db.once('open',()=>{console.log("db connection successfull...")})

module.exports = db;