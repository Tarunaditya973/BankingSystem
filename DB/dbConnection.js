const mongoose = require("mongoose");
require("dotenv").config();

const dbConnection = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("DB connection successfull");
  } catch (err) {
    console.log("Error while connecting DB", err);
  }
};

module.exports = dbConnection;
