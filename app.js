const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

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

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")));

app.get("/", (req, res) => {
  res.send("Hi, I am root");
});
//Index Route
app.get("/listings", async (req, res) => {
  const allListings = await Listing.find({});
  res.render("listings/index.ejs", { allListings });
});
//Show Route
app.get("/listings/:id", async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  res.render("listings/show.ejs", { listing });
});
// ADD NEW get
app.get("/listing/new", async (req, res) => {
  res.render("listings/new.ejs");
});
// ADD NEW POST
//way1
/*app.post(("/listings/new"),async (req,res)=>{
  let {title,description,image,price,country,location} = req.body;
  let list = new Listing({
    title:title,
    description:description,
    image:image[url],
    price:price,
    country:country,
    location:location,
  });
  list.save().then(res=>{
    console.log(res);
  }).catch((err)=>{
    console.log(err);
  })
  res.redirect("/listings");
})*/
//way2
app.post(
  "/listings",
  wrapAsync(async (req, res, next) => {
    const newList = new Listing(req.body.listing);
    await newList.save();
    res.redirect("/listings");
  })
);
//Edit and update
app.get("/listings/:id/edit", async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  res.render("listings/edit.ejs", { listing });
});
//Update
app.put("/listings/:id", async (req, res) => {
  let { id } = req.params;
  await Listing.findByIdAndUpdate(id, { ...req.body.listing });
  res.redirect(`/listings/${id}`);
});
//delete
app.delete("/listings/:id", async (req, res) => {
  let { id } = req.params;
  let deleteListing = await Listing.findByIdAndDelete(id);
  console.log(deleteListing);
  res.redirect("/listings");
});
// app.get("/test", (req, res) => {
//   res.render("listings/test.ejs");
// });
// app.post("/test", (req, res) => {
//   res.render("listings/index.ejs");
// });

app.use((err, req, res, next) => {
  res.send("SOMTHING WENT WRONG!");
});

app.listen(8080, () => {
  console.log("server is listening to port 8080");
});
