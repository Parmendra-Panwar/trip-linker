const express = require("express");
const app = express();
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const connectDB = require("./config/db");
const cookieParser = require("cookie-parser");

const listings = require("./routes/listing.js");
const reviews = require("./routes/review.js")
// MongoDB connection
connectDB();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")));
app.use(cookieParser("secretcode"));

app.use("/listings", listings)
app.use("/listings/:id/reviews", reviews)

//cookies
app.get("/cookies", (req, res) => {
  res.cookie("made-in", "india", { signed: true });
  res.send("Cookies set");
})
app.get("/checkforcookies", (req, res) => {
  console.log(req.signedCookies);
  res.send("verified");
})

//root route landing page
app.get("/", (req, res) => {
  res.send("Hi I am root");
})

//rendom
app.all("*", (req, res, next) => {
  next(new ExpressError(404, "Page not found"));
});

//errorhandling
app.use((err, req, res, next) => {
  let { statusCode = 500, message = "Somthing went Wrong" } = err;
  res.status(statusCode).render("error.ejs", { err });
  //res.status(statusCode).send(message);
});

app.listen(8080, () => {
  console.log("server is listening to port 8080");
});
