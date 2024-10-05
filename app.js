const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
const { listingSchema, reviewSchema } = require("./schema.js");
const Review = require("./models/review.js");
const connectDB = require("./config/db");
const validateListing = require("./validators/listingValidator");
const validateReview = require("./validators/reviewValidator");

// MongoDB connection
connectDB();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")));

//Index Route
app.get(
  "/listings",
  wrapAsync(async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
  })
);
//Show Route
app.get(
  "/listings/:id",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id).populate('reviews');
    const reviews = await Promise.all(listing.reviews.map(review => Review.findById(review._id)));
    res.render("listings/show.ejs", { listing, reviews });
  })
);
// ADD NEW get
app.get(
  "/listing/new",
  wrapAsync(async (req, res) => {
    res.render("listings/new.ejs");
  })
);
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
  validateListing,
  wrapAsync(async (req, res, next) => {
    // if (!req.body.listing) {
    //   throw new ExpressError(400, "send Valid data to listing");
    // }
    // let result = listingSchema.validate(req.body);
    // console.log(result);
    // if (result.error) {
    //   throw new ExpressError(400, result.error);
    // }
    const newList = new Listing(req.body.listing);
    await newList.save();
    res.redirect("/listings");
  })
);
//Edit and update
app.get(
  "/listings/:id/edit",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs", { listing });
  })
);
//Update
app.put(
  "/listings/:id",
  validateListing,
  wrapAsync(async (req, res) => {
    // if (!req.body.listing) {
    //   throw new ExpressError(400, "send Valid data to listing");
    // }
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    res.redirect(`/listings/${id}`);
  })
);
//delete
app.delete(
  "/listings/:id",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    let deleteListing = await Listing.findByIdAndDelete(id);
    console.log(deleteListing);
    res.redirect("/listings");
  })
);
//REVIEWS
//post
app.post("/listings/:id/reviews", validateReview, wrapAsync(async (req, res) => {
  let { id } = req.params;
  let listing = await Listing.findById(id);
  let newReview = new Review(req.body.review);
  listing.reviews.push(newReview);
  await newReview.save();
  await listing.save();
  //console.log("new Review Save")
  res.redirect(`/listings/${listing._id}`);
}));
//delete review post route
app.delete("/listings/:id/reviews/:reviewId", wrapAsync(async (req, res) => {
  let { id, reviewId } = req.params;
  await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } })
  await Review.findByIdAndDelete(reviewId);

  res.redirect(`/listings/${id}`)
}
))
// app.get("/test", (req, res) => {
//   res.render("listings/test.ejs");
// });
// app.post("/test", (req, res) => {
//   res.render("listings/index.ejs");
// });

//rendom
app.all("*", (req, res, next) => {
  next(new ExpressError(404, "Page not found"));
});

app.use((err, req, res, next) => {
  let { statusCode = 500, message = "Somthing went Wrong" } = err;
  res.status(statusCode).render("error.ejs", { err });
  //res.status(statusCode).send(message);
});

app.listen(8080, () => {
  console.log("server is listening to port 8080");
});
