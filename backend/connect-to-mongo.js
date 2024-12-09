const mongoose = require("mongoose");
mongoose.set("strictQuery", false);
require("dotenv").config()
const url = process.env.MONGODB_URI;

const connectToMongo = () => {
  console.log("connecting to", url);
  mongoose
    .connect(url)
    .then(() => {
      console.log("connected to MongoDB");
    })
    .catch((error) => {
      console.log("error connecting to MongoDB:", error.message);
    });
};

module.exports = connectToMongo;
