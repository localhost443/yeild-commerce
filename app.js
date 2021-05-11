'use strict';
const express = require('express');
const session = require('express-session');
const mongoose = require("mongoose");
const mongoDBsession = require('connect-mongodb-session')(session);
const csrf = require('csurf');
const bodyparser = require('body-parser');
const dir = require('./helper/dir');
const User = require('./model/User');
let flash = require('connect-flash');

/**
 * Importing required files to work with expressjs
 * such as Routes or other data that may need
 *
 */
const routeAdmin = require('./routes/AdminRoute');
const UserRoute = require('./routes/UserRoute');
const routeUser = require('./routes/ShopRoute');


const conn = 'mongodb://localhost:27017/myshop';

/**
 * Initiating express
 * @type {*|Express}
 */
const app = express();
/**
 * Initiating session store
 */
const store = new mongoDBsession({
  uri: conn,
  collection: 'sessions',
});
/**
 * Setting up Template Engine EJS and body parser to parse the
 * incoming data
 */
app.set('view engine', 'ejs');
app.set('views', 'views');

/**
 * using body parser to get data that
 * the application may come acroos
 */
app.use(bodyparser.urlencoded({extended: false}));
app.use(session({
  secret: 'SEC2SEC8RE$TSE2CR$ET24$ML/KJMLlE$JJJ',
  resave: false,
  saveUninitialized: false,
  store: store
}));

app.use((req, res, next) => {
  if (req.session.isLoggedIn) {
    User.findById(req.session.userId)
      .then((user) => {
        req.user = user;
        // console.log(req.session);
        next();
      })
  } else {
    next()
  }
})
app.use(flash());
app.use((req, res, next) => {
  res.locals.message = req.flash()
  next()
})




let csrfProtection = csrf(undefined);
app.use(csrfProtection, );

app.use((req, res, next) => {
  req.session.isLoggedIn ? res.locals.isLoggedIn = true : res.locals.isLoggedIn = false
  res.locals.csrfTokens = req.csrfToken()
  next()
})
/**
 * serve static files
 */

app.use(express.static(dir(['static'])));

/**
 * Using the routes from different places
 */

app.use('/admin', routeAdmin);
app.use(routeUser);
app.use(UserRoute);
/**
 * Testing
 */
app.get('/cart', (req, res, next) => {
  res.render('cart', {
    data: {
      title: 'cart'
    }
  });
});

app.use((req, res, next) => {
  res.render('error404', {data: {error: 404, name: 'Error404 on the way'}});
});
/**
 * starting the server with mongoose
 */
mongoose.connect(conn, {useNewUrlParser: true, useUnifiedTopology: true})
  .then(r => {
    app.listen(8000, () => {
      console.log(`Server started on port http://localhost:8000`);
    });
  }).catch(err => console.log(err));
