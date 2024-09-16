const mongoose = require('mongoose'); 
 
const connectDB = () => { 
  mongoose.connect(process.env.CONNECTION_STRING);
  mongoose.connection.once('open', () => { 
    console.log('connected to database'); 
  }); 
  
  mongoose.connection.on('error', console.error); 
} 
module.exports = connectDB;