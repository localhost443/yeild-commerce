'use strict';
let debug = true;
const crypto = require('crypto');
const nodemailer = require('nodemailer');
/**
 * importing the User modal for some extended functionlities
 * @type {Model<Document>}
 */
const User = require('../model/User');

/**
 * Importing bcrypt function to encrypt
 * and decrypt the password
 * @type {{genSaltSync?: function(*=, *=): *, genSalt?: function(*=, *=, *=): (Promise<never>|Promise<unknown>|undefined), hashSync?: function(*=, *=): *, hash?: function(*=, *=, *=): (void), compareSync?: function(*=, *=): *, compare?: function(*=, *=, *=): (void), getRounds?: function(*=): *}}
 */
const bcrypt = require('bcrypt');
const saltRounds = 10;

let transporter = nodemailer.createTransport({
  host: 'localhost',
  port: 25,
  secure: false, // true for 465, false for other ports
});

exports.register = (req, res) => {
  if (req.session.isLoggedIn) {
    res.redirect('/shop');
  }
  res.render('user/register', {
    data: {
      title: 'Please Register',
      // session
    },
  });
};

exports.registration = (req, res) => {
  let name = req.body.name,
    username = req.body.username,
    email = req.body.email,
    p1 = req.body.password,
    p2 = req.body.confirmPassword;
  let shop = req.body.shop;
  let shopExist;
  shop ? (shopExist = 'vendor') : (shopExist = 'subscriber');
  if (p1 === p2) {
    if (name && username && email) {
      User.findOne({ email: email })
        .then((UserDoc) => {
          if (UserDoc && UserDoc.email === email) {
            res.render('user/register', {
              data: {
                title: 'Please Register',
                isRegistered: 'This email is already in our database',
              },
            });
          } else {
            bcrypt.genSalt(saltRounds, function (err, salt) {
              bcrypt.hash(p1, salt, function (err, hash) {
                let user = new User({
                  name,
                  username,
                  email,
                  password: hash,
                  role: shopExist,
                });
                user.save().then(() => {
                  res.redirect('/login/');
                  transporter.sendMail({
                    from: '"Fred Foo 👻" <foo@example.com>', // sender address
                    to: 'bar@example.com', // list of receivers
                    subject: 'Hello ✔', // Subject line
                    text: 'Hello world?', // plain text body
                    html: '<b>Hello world?</b>', // html body
                  });
                });
              });
            });
          }
        })
        .catch((err) => {
          if (debug) console.log(err);
        });
    }
  }
};

exports.login = (req, res) => {
  if (req.session.isLoggedIn) {
    res.redirect('/orders/');
  } else {
    res.render('user/login', {
      data: {
        title: 'Please Login',
        cToken: req.csrfToken(),
      },
    });
  }
};

exports.userLogin = (req, res) => {
  if (req.session.isLoggedIn) {
    return res.redirect('/orders/');
  } else {
    if (!req.body.email || !req.body.password) {
      req.flash('error', 'User Email or Password Is not Valid');
      return res.redirect('/login/');
    }
    User.findOne({ email: req.body.email }).then((User) => {
      if (User) {
        bcrypt.compare(
          req.body.password,
          User.password,
          function (err, result) {
            if (result) {
              req.session.isLoggedIn = true;
              req.session.userId = User._id;
              if (User.role === 'vendor') req.session.vendor = true;
              req.session.save((err) => console.log(err));
              res.redirect('/shop/');
            } else {
              req.flash('error', 'Username or Email Not Found');
              return res.redirect('/login');
            }
          }
        );
      } else {
        req.flash('error', 'Username or Email Not Found');
        return res.redirect('/login');
      }
    });
  }
};

exports.reset = (req, res) => {
  if (req.method === 'GET') {
    res.render('user/reset', {
      data: {
        title: 'Password Reset',
        cToken: req.csrfToken(),
      },
    });
  }
  if (req.method === 'POST') {
    if (!req.body.email) {
      req.flash('error', "You can't leave email box empty");
      res.redirect('/reset');
    } else {
      User.findOne({ email: req.body.email })
        .then((user) => {
          if (user) {
            crypto.randomBytes(32, (err, buff) => {
              if (err) {
                req.flash('error', 'Something is wrong, Please try later');
                res.redirect('/reset');
              } else {
                user.resetToken = buff.toString('hex');
                user.resetExpTime = Date.now() + 3600000;
                user
                  .save()
                  .then(() => {
                    req.flash(
                      'info',
                      'if the email exist in our database, Please check your inbox/spam folder'
                    );
                    res.redirect('/reset');
                  })
                  .then(() => {
                    return transporter
                      .sendMail({
                        from: '"Fred Foo 👻" <foo@example.com>', // sender address
                        to: user.email, // list of receivers
                        subject: 'Password Reset Token ✔', // Subject line
                        html: `<h1>Hello User </h1>
                          <p>Someone requested a password request for your account</p>
                          <p><a href="http://localhost/resetpass/${user.resetToken}">Click Here</a>
                           to reset you account</p>
                           <p>If you didn't request this email, Just ignore this message, And you will be fine</p>
                          `,
                      })
                      .then(() => console.log('success'))
                      .catch((err) => console.log(err));
                  });
              }
            });
          } else {
            req.flash(
              'error',
              "This email is not registered, Try <a class='text-blue-400' href='/register'> register </a>  option"
            );
            res.redirect('/reset');
          }
        })
        .catch((err) => console.log(err));
    }
  }
};

exports.resetpass = (req, res) => {
  if (req.method === 'GET') {
    User.findOne({ resetToken: req.params.userhash })
      .then((user) => {
        if (user) {
          if (user.resetExpTime >= Date.now()) {
            res.render('user/resetpass', {
              data: {
                title: 'Reset your password',
                resetcode: req.params.userhash,
              },
            });
          }
        }
      })
      .catch((err) => console.log(err));
  }
  if (req.method === 'POST') {
    let hashkey = req.body.hashkey;
    if (!hashkey) res.redirect('/reset');
    let email = req.body.email;
    if (!email) {
      req.flash('error', "Email field can't be left empty");
      return res.redirect('/resetpass/' + hashkey);
    }
    let password = req.body.password;
    if (!password) {
      req.flash('error', "password field can't be left empty");
      return res.redirect('/resetpass/' + hashkey);
    }
    User.findOne({ resetToken: hashkey }).then((user) => {
      if (user) {
        if (user.email === email) {
          bcrypt.genSalt(saltRounds, function (err, salt) {
            bcrypt.hash(password, salt, function (err, hash) {
              user.password = hash;
              user.resetExpTime = null;
              user.resetToken = null;
              user.save().then(() => {
                req.flash(
                  'info',
                  'Your password has been updated, Please login with new password'
                );
                res.redirect('/login/');
                return transporter
                  .sendMail({
                    from: '"Fred Foo 👻" <foo@example.com>', // sender address
                    to: 'bar@example.com', // list of receivers
                    subject: 'Hello ✔', // Subject line
                    text: 'Hello world?', // plain text body
                    html: 'Your password has been updated', // html body
                  })
                  .catch((err) => console.log(err));
              });
            });
          });
        } else {
          return res.redirect('/resetpass/' + hashkey);
        }
      } else {
        return res.redirect('/reset');
      }
    });
  }
};

exports.logout = (req, res) => {
  req.session.destroy(() => {
    res.redirect('/login/');
  });
};
