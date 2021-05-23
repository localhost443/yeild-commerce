'use strict';
const Express = require('express');
const UserController = require('../controller/UserController');
const AuthController = require('../controller/AuthController');
const userAuth = require('../helper/UserLoggedIn');
const { check } = require('express-validator');
const User = require('../model/User');
const router = Express.Router();

router.get('/register/', AuthController.register);
router.post(
  '/register/',
  check('email')
    .isEmail()
    .withMessage('Your email is invalid , Please enter a right email')
    .custom((value, { req }) => {
      User.findOne({ email: value })
        .then((user) => {
          if (user && user.email === value) {
            return Promise.reject(
              'How did you forgot me sir ? You already registered, Try resetting your password'
            );
          }
        })
        .catch((err) => console.log(err));
    })
    .withMessage(
      'How did you forgot me sir ? You already registered, Try resetting your password'
    ),
  AuthController.registration
);

router.get('/login/', userAuth.notIsLoggedIn, AuthController.login);
router.post('/login/', userAuth.notIsLoggedIn, AuthController.userLogin);
router.post('/logout/', userAuth.isLoggedIn, AuthController.logout);

router.get('/reset/', userAuth.notIsLoggedIn, AuthController.reset);
router.get(
  '/resetpass/:userhash',
  userAuth.notIsLoggedIn,
  AuthController.resetpass
);
router.post('/resetpass/', userAuth.notIsLoggedIn, AuthController.resetpass);
router.post('/reset/', userAuth.notIsLoggedIn, AuthController.reset);

router.get('/addcart/:productId', UserController.addToCart);
router.get('/removecart/:cartId', UserController.removeFromCart);

router.use('/checkout/', UserController.checkout);
router.get('/order/success', UserController.success);
// router.get('/order/failed', UserController.failed);
router.get('/orders/', UserController.orderList);

module.exports = router;
