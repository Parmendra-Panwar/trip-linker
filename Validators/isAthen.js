module.exports.isloggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.flash("error", "You Must be Logged in to create listing")
    return res.redirect('/login')
  }
  next();
}

