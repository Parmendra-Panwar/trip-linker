const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

const MONGO_URL = "mongodb+srv://MyAirBnB:MyAirBnB21@cluster0.y6bvz.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(MONGO_URL);
}

const initDB = async () => {
  await Listing.deleteMany({});
  initData.data = initData.data.map((obj) => ({ ...obj, user: "670697e27276c8d34ffd59de" }));
  await Listing.insertMany(initData.data);
  console.log("data was initialized");
  console.log(initData.data);
};

initDB();
