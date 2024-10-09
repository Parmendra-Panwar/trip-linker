module.exports.isloggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    //save url
    req.session.returnTo = req.originalUrl;
    req.flash("error", "You Must be Logged in to create listing")
    return res.redirect('/login')
  }
  next();
}

//for redirectional perpos

module.exports.saveRedirect = (req, res, next) => {
  if (req.session.returnTo) {
    res.locals.returnTo = req.session.returnTo;
  }
  next();
}