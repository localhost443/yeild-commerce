"use strict"
const crypto = require('crypto');
const nodemailer = require("nodemailer");
/**
 * importing the User modal for some extended functionlities
 * @type {Model<Document>}
 */
const User = require('../model/User')

/**
 * Importing bcrypt function to encrypt
 * and decrypt the password
 * @type {{genSaltSync?: function(*=, *=): *, genSalt?: function(*=, *=, *=): (Promise<never>|Promise<unknown>|undefined), hashSync?: function(*=, *=): *, hash?: function(*=, *=, *=): (void), compareSync?: function(*=, *=): *, compare?: function(*=, *=, *=): (void), getRounds?: function(*=): *}}
 */
const bcrypt = require('bcrypt');
const saltRounds = 10;


let transporter = nodemailer.createTransport({
  host: "localhost",
  port: 25,
  secure: false, // true for 465, false for other ports
});

exports.register = (req, res) => {
  if (req.session.isLoggedIn) {
    res.redirect('shop');
  }
  res.render('user/register', {
    data: {
      title: 'Please Register',
      // session
    }
  });
};

exports.registration = (req, res) => {
  // console.log(req.body);
  let name = req.body.name, username = req.body.username, email = req.body.email, p1 = req.body.password,
    p2 = req.body.confirmPassword;
  if (p1 === p2) {
    if (name && username && email) {
      User.findOne({email: email})
        .then((UserDoc) => {
          if (UserDoc && UserDoc.email === email) {
            res.render('user/register', {
              data: {
                title: 'Please Register',
                isRegistered: 'This email is already in our database',
              }
            });
          } else {
            bcrypt.genSalt(saltRounds, function (err, salt) {
              bcrypt.hash(p1, salt, function (err, hash) {
                let user = new User({
                  name, username, email,
                  password: hash
                });
                user.save().then(() => {
                  res.redirect('/login/');
                  transporter.sendMail({
                    from: '"Fred Foo 👻" <foo@example.com>', // sender address
                    to: "bar@example.com", // list of receivers
                    subject: "Hello ✔", // Subject line
                    text: "Hello world?", // plain text body
                    html: "<b>Hello world?</b>", // html body
                  });
                })
              });
            });
          }
        })
        .catch(err => console.log(err));
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
      }
    });
  }
};

exports.userLogin = (req, res) => {
  if (req.session.isLoggedIn) {
    res.redirect('/orders/');
  } else {
    if (!req.body.email || !req.body.password) {
      res.render('user/login', {
        data: {
          title: 'Please Login',
          cToken: req.csrfToken(),
          message: "Email and Password is Required"
        }
      });
    }
    User.findOne({email: req.body.email})
      .then((User) => {
        if (User && User.password) {
          bcrypt.compare(req.body.password, User.password, function (err, result) {
            console.log(err, result);
            if (result === true) {
              console.log('Result is true');
              req.session.isLoggedIn = true;
              req.session.userId = User._id;
              req.session.save(err => console.log(err));
              res.redirect('/shop/');
            }
          });
        } else {
          res.render('user/login', {
            data: {
              title: 'Please Login',
              cToken: req.csrfToken(),
              message: "Invalid Email Or Password"
            }
          });
        }
      })
  }
};

exports.reset = (req, res) => {
  let renderFile = function (message = null) {
    res.render('user/reset', {
      data: {
        title: "Password Reset",
        cToken: req.csrfToken(),
        message: message
      }
    })
  }
  if (req.method === "GET") {
    renderFile()
  }
  if (req.method === "POST") {
    if (!req.body.email) {
      renderFile('Email field is required');
    } else {
      User.findOne({email: req.body.email})
        .then((user) => {
          if (user) {
            //console.log(user)
            crypto.randomBytes(32, (err, buff) => {
              if (err) renderFile("Something is wrong, Please try later");
              else {
                user.resetToken = buff.toString('hex');
                user.resetExpTime = Date.now() + 3600000;
                user.save()
                  .then(() => {
                    return transporter.sendMail({
                      from: '"Fred Foo 👻" <foo@example.com>', // sender address
                      to: user.email, // list of receivers
                      subject: "Password Reset Token ✔", // Subject line
                      text: "Hello, Someone has requested a password reset token for you please follow the link to get it " + user.resetToken, // plain text body
                      html: "<a href='localhost/resetpass/"+ user.resetToken +"' />", // html body
                    });
                  })
                  .then(() => {
                    req.flash('info', 'if the email exist in our database, Please check your inbox/spam folder')
                    res.redirect('/login')
                  })
              }
            })
          } else {
            renderFile("This user is not registered, Please Register");
          }
        })
        .catch(err => console.log(err))
    }
  }
}

exports.logout = (req, res) => {
  req.session.destroy(() => {
    res.redirect('/login/');
  });
};