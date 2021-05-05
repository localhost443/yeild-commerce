'use strict';
const lodash = require('lodash');
const stripe = require('stripe')('sk_test_wpSquKlgmFNsOYGuTiAJGXLe00aVSD5GUj');

const User = require('../model/User');
/**
 * User Login and Register related logic goes here
 */
exports.register = (req, res) => {
  const session = req.session.isLoggedIn ? req.session.isLoggedIn : false;
  res.render('user/register', {
    data: {
      title: 'Please Register',
      session
    }
  });
};

exports.registration = (req, res) => {
  // console.log(req.body);
  const session = req.session.isLoggedIn ? req.session.isLoggedIn : false;
  let name = req.body.name, username = req.body.username, email = req.body.email, p1 = req.body.password,
    p2 = req.body.confirmPassword;
  if (p1 === p2) {
    if (name && username && email) {
      let user = new User({
        name, username, email,
        password: p1
      });
      user.save().then(() => {
        res.redirect('/shop/');
      })
        .catch((error) => console.log(error));
    }
  }
};

exports.login = (req, res) => {
  const session = req.session.isLoggedIn ? req.session.isLoggedIn : false;
  if(session === true) {
    res.redirect('/orders/');
  } else {
    res.render('user/login', {
      data: {
        title: 'Please Login',
        session
      }
    });
  }
};

exports.userLogin = (req, res) => {
  // console.log(req.body);
  // res.end('Data Recieved');
  req.session.isLoggedIn = true;
  res.redirect('/shop/');
};

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
  const session = req.session.isLoggedIn ? req.session.isLoggedIn : false;
  req.user.populate('cart.items.productId')
    .execPopulate()
    .then((user) => {
      let totalPrice = 0;
      for (let i = 0; i < user.cart.items.length; i++) {
        totalPrice = totalPrice + (user.cart.items[i].quantity * user.cart.items[i].productId.price);
      }
      console.log(totalPrice);
      if (req.method === 'POST') {
        async function recievedata() {
          const paymentData = await stripe.paymentIntents.create({
            amount: totalPrice * 100,
            currency: 'usd'
          });
          return paymentData;
        }

        recievedata().then((paymentData) => {
          res.send({
            paymentSecret: paymentData.client_secret
          });
        });
      } else {
        res.render('user/checkout', {
          data: {
            title: 'Welcome to checkout',
            products: user.cart.items,
            name: 'Online Shop'
          }
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
        quantity: data.quantity
      });
    });
    req.user.cart.items = [];
    // req.user.orders.items = [];
    req.user.save()
      .then(() => console.log('saved'))
      .then(() => console.log(req.user))
      .catch(err => console.log(err));
  }
  res.end('data recieved');
};

exports.createOrder = (req, res) => {
  const session = req.session.isLoggedIn ? req.session.isLoggedIn : false;
  res.render('payment', {
    data: {
      title: 'Please pay now'
    }
  });
};
exports.orderList = (req, res) => {
  req.user.populate('orders.items.productId')
    .execPopulate()
    .then((user) => {
      // console.log(user.orders.items);
      res.render('user/orderlist', {
        data: {
          title: 'Your order List',
          orderlist: user.orders.items
        }
      });
    });
};

exports.logout = (req, res) => {
  req.session.destroy(() => {
    res.redirect('/login/');
  });

};