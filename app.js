'use strict';
/**
 * Importing required modules to work with expressjs
 * @type {e | (() => Express)}
 */
const express = require('express');
const session = require('express-session');
const mongoDBsession = require('connect-mongodb-session')(session);
const mongoose = require('mongoose');
const bodyparser = require('body-parser');
const dir = require('./helper/dir');

/**
 * Importing required files to work with expressjs
 * such as Routes or other data that may need
 * @type {Router}
 */
const routeAdmin = require('./routes/AdminRoute');
const UserRoute = require('./routes/UserRoute');
const routeUser = require('./routes/ShopRoute');
// const routeUser = require('./routes/ShopRoute');


/**
 * initiating required modals
 * @type {Model<Document>}
 */
const User = require('./model/User');
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
  uri : conn,
  collection: 'sessions',
});
/**
 * Setting up Template Engine EJS and body parser to parse the
 * incoming data
 */
app.set('view engine', 'ejs');
app.set('views', 'backend/views');



/**
 * using body parser to get data that
 * the application may come acroos
 */
app.use(bodyparser.urlencoded({ extended: false }));
app.use(session({
  secret: 'SEC2SEC8RE$TSE2CR$ET24$ML/KJMLlE$JJJ',
  resave: false,
  saveUninitialized: false,
  store : store

}));

/**
 * serve static files
 */
app.use((req, res, next) => {
  User.findOne()
    .then((user) => {
      console.log(req.session);
      req.user = user;
      next();
    }).catch((err) => console.log(err));
});
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
  res.render('error404', { data: { error: 404, name: 'Error404 on the way' } });
});
/**
 * starting the server with mongoose
 */
mongoose.connect(conn, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(r => {
    app.listen(8000, 'localhost', () => {
      console.log(`Server started on port http://localhost:8000`);
    });
  }).catch(err => console.log(err));
