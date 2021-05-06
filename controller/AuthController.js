"use strict"
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


exports.register = (req, res) => {
  if(req.session.isLoggedIn) {
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
            bcrypt.genSalt(saltRounds, function(err, salt) {
              bcrypt.hash(p1, salt, function(err, hash) {
                let user = new User({
                  name, username, email,
                  password: hash
                });
                user.save().then(() => {
                  res.end("data recieved");
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
  let session = req.session;
  if (session === true) {
    res.redirect('/orders/');
  } else {
    res.render('user/login', {
      data: {
        title: 'Please Login',
        session,
        cToken : req.csrfToken(),
      }
    });
  }
};

exports.userLogin = (req, res) => {
  console.log(req.body.email, req.body.password);
  User.findOne({email: req.body.email})
    .then((User) => {
      if(User && User.password) {
        bcrypt.compare(req.body.password, User.password, function(err, result) {
          console.log(err, result);
          if(result === true) {
            console.log('Result is true');
            req.session.isLoggedIn = true;
            req.session.user = User;
            req.session.save(err => console.log(err));
            res.redirect('/shop/');

          }
        });
      }
    })

  // console.log(req.body);
  // res.end('Data Recieved');
  // req.session.isLoggedIn = true;
  // res.redirect('/shop/');
};

exports.logout = (req, res) => {
  req.session.destroy(() => {
    res.redirect('/login/');
  });
};