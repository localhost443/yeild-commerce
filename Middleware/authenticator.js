'use strict';
exports.needLoggedIn = (req, res, next) => {
  if (req.session.isLoggedIn) {
    return next();
  } else {
    req.flash('info', 'You need to log in to use this service');
    return res.redirect('/login/');
  }
};

exports.needLoggedOut = (req, res, next) => {
  if (!req.session.isLoggedIn) {
    return next();
  } else {
    req.flash('info', 'You are already logged in');
    return res.redirect('/');
  }
};
