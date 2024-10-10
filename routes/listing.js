const express = require("express");
const router = express.Router();
const validateListing = require("../Validators/listingValidator.js");
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const { isloggedIn, isOwner } = require("../Validators/isAthen.js");
const listingController = require("../controller/listing.js");

//Index Route
router.get("/", wrapAsync(listingController.index));

// ADD NEW get
router.get("/new", isloggedIn, wrapAsync(listingController.createNewget));
//Show Route
router.get("/:id", wrapAsync(listingController.showListing));
//new user created
router.post(
  "/",
  isloggedIn,
  validateListing,
  wrapAsync(listingController.createNewpost)
);
//Edit and update
router.get(
  "/:id/edit",
  isloggedIn,
  isOwner,
  wrapAsync(listingController.editListing)
);
//Update
router.put(
  "/:id",
  isloggedIn,
  isOwner,
  validateListing,
  wrapAsync(listingController.updateListing)
);
//delete
router.delete(
  "/:id",
  isloggedIn,
  isOwner,
  wrapAsync(listingController.destroy)
);

module.exports = router;
