'use strict';
const lodash = require('lodash');
const userAuth = require('../helper/UserLoggedIn');
const stripe = require('stripe')('sk_test_wpSquKlgmFNsOYGuTiAJGXLe00aVSD5GUj');

const User = require('../model/User');
/**
 * User Login and Register related logic goes here
 */

exports.addToCart = (req, res) => {
  const session = req.session.isLoggedIn ? req.session.isLoggedIn : false;
  // console.log(req.params);
  req.user.addToCart(req.params.productId);
  // res.end('request revieved');
  // let backURL=req.header('Referer') || '/';
  res.redirect('/shop/');
};

exports.removeFromCart = (req, res) => {
  const session = req.session.isLoggedIn ? req.session.isLoggedIn : false;
  // console.log(req.user.cart.items[0]);
  let data = req.user.cart.items.filter((cart) => {
    if (req.params.cartId.toString() !== cart._id.toString()) {
      return cart;
    }
  });
  req.user.cart.items = data;
  req.user.save();
  res.redirect('/checkout/');
};

exports.checkout = (req, res) => {
  if (!req.session.isLoggedIn) {
    req.flash(
      'info',
      'You need to log in or register to use checkout functionalities'
    );
    return res.redirect('/login');
  }
  req.user
    .populate('cart.items.productId')
    .execPopulate()
    .then((user) => {
      let totalPrice = 0;
      for (let i = 0; i < user.cart.items.length; i++) {
        totalPrice =
          totalPrice +
          user.cart.items[i].quantity * user.cart.items[i].productId.price;
      }
      console.log(totalPrice);
      if (req.method === 'POST') {
        async function recievedata() {
          const paymentData = await stripe.paymentIntents.create({
            amount: totalPrice * 100,
            currency: 'usd',
          });
          return paymentData;
        }

        recievedata().then((paymentData) => {
          res.send({
            paymentSecret: paymentData.client_secret,
          });
        });
      } else {
        res.render('user/checkout', {
          data: {
            title: 'Welcome to checkout',
            products: user.cart.items,
            name: 'Online Shop',
          },
        });
      }
    });
};
exports.success = (req, res) => {
  const session = req.session.isLoggedIn ? req.session.isLoggedIn : false;
  if (!lodash.isEmpty(req.user.cart.items)) {
    req.user.cart.items.map((data) => {
      console.log(data);
      req.user.orders.items.push({
        productId: data.productId,
        quantity: data.quantity,
      });
    });
    req.user.cart.items = [];
    // req.user.orders.items = [];
    req.user
      .save()
      .then(() => console.log('saved'))
      .then(() => console.log(req.user))
      .catch((err) => console.log(err));
  }
  res.end('data recieved');
};

exports.createOrder = (req, res) => {
  const session = req.session.isLoggedIn ? req.session.isLoggedIn : false;
  res.render('payment', {
    data: {
      title: 'Please pay now',
    },
  });
};
exports.orderList = (req, res) => {
  req.user
    .populate('orders.items.productId')
    .execPopulate()
    .then((user) => {
      // console.log(user.orders.items);
      res.render('user/orderlist', {
        data: {
          title: 'Your order List',
          orderlist: user.orders.items,
        },
      });
    });
};
