const mongoose = require("mongoose");

const MONGO_URL = "mongodb+srv://MyAirBnB:MyAirBnB21@cluster0.y6bvz.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URL);
    console.log("Connected to MongoDB");
  } catch (err) {
    console.error("Failed to connect to MongoDB", err);
    process.exit(1);  // Exit the process with an error code
  }
};

module.exports = connectDB;



// older method to connect with mongo
// const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
// main()
//   .then(() => {
//     console.log("connected to DB");
//   })
//   .catch((err) => {
//     console.log(err);
//   });
// async function main() {
//   await mongoose.connect(MONGO_URL);
// }