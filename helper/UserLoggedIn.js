exports.notIsLoggedIn = (req, res, next) => {
  if (req.session.isLoggedIn) {
    res.redirect("/shop/");
  } else {
    next();
  }
}

exports.isLoggedIn = (req, res, next) => {
  if (!req.session.isLoggedIn) {
    req.redirect("/login");
  } else {
    next()
  }
}