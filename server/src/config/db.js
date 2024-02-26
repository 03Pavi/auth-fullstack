const mongoose = require('mongoose');
const dotenv = require("dotenv");
dotenv.config();
const DB_URL = process.env.DB_URL;
const connectDB = async () => {
    try {
      const conn = await mongoose.connect(DB_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true
      });
      console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
      console.error(error.message);
      process.exit(1);
    }
  }
module.exports=connectDB