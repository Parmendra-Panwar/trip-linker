const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");

// GET /signup
router.get("/signup", (req, res) => {
  res.render("users/Aten.ejs");
});

// POST /signup
router.post("/signup", wrapAsync(async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Validate input data
    if (!username || !email || !password) {
      req.flash("error", "Please fill in all fields.");
      return res.redirect("/signup");
    }

    // Check if email is already in use
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      req.flash("error", "Email address already in use.");
      return res.redirect("/signup");
    }

    // Create a new user
    const newUser = new User({ email, username });
    await User.register(newUser, password);

    req.flash("success", "Welcome to WonderLand!");
    res.redirect("/listings");
  } catch (e) {
    // Handle specific errors
    if (e.name === "ValidationError") {
      req.flash("error", "Invalid input data.");
    } else {
      req.flash("error", "An error occurred. Please try again.");
    }
    res.redirect("/signup");
  }
}));


router.get("/login", (req, res) => {
  res.render("users/login.ejs");
})

router.post("/login", passport.authenticate("local", { failureRedirect: '/login', failureFlash: true }), async (req, res) => {
  req.flash("success", "Welcome back to WonderLand!");
  res.redirect("/listings");
})

module.exports = router; 