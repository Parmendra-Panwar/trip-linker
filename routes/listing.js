const express = require("express");
const router = express.Router();
const validateListing = require("../Validators/listingValidator.js");
const { listingSchema } = require("../schema.js");
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const Listing = require("../models/listing.js");
const { isloggedIn } = require("../Validators/isAthen.js")

//Index Route
router.get(
  "/",
  wrapAsync(async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
  })
);

// ADD NEW get
router.get(
  "/new", isloggedIn,
  wrapAsync(async (req, res) => {
    res.render("listings/new.ejs");
  })
);
//Show Route
router.get(
  "/:id",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id).populate('reviews').populate("user");
    if (!listing) {
      req.flash('error', "Listing are you requested for does not exist"
      )
      res.redirect("/listings")
    }
    res.render("listings/show.ejs", { listing });
  })
);
/*router.post(("/listings/new"),async (req,res)=>{
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
//way2//new user created
router.post(
  "/", isloggedIn,
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
    newList.user = req.user._id;
    await newList.save();
    req.flash('success', "New Listing Created");
    res.redirect("/listings");
  })
);
//Edit and update
router.get(
  "/:id/edit", isloggedIn,
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
      req.flash('error', "Listing are you requested for does not exist")
      res.redirect("/listings");
    }
    res.render("listings/edit.ejs", { listing });
  })
);
//Update
router.put(
  "/:id", isloggedIn,
  validateListing,
  wrapAsync(async (req, res) => {
    // if (!req.body.listing) {
    //   throw new ExpressError(400, "send Valid data to listing");
    // }
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });

    req.flash('success', "Listing Updated")
    res.redirect(`/listings/${id}`);
  })
);
//delete
router.delete(
  "/:id", isloggedIn,
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    let deleteListing = await Listing.findByIdAndDelete(id);
    req.flash('success', "Listing Deleted")
    res.redirect("/listings");
  })
);


module.exports = router; 