'use strict';
const User = require('../model/User')
const Product = require('../model/Product');
exports.shop = (req, res) => {
  let session;
  req.session.isLoggedIn ? session = req.session.isLoggedIn : session = false;
  Product.find().then((products) => {
    // console.log(req.user);
    // console.log(products);
    res.render('shop', {
      data: {
        title: 'Shop Page',
        products,
        session
      }
    });
  });
};
exports.SingleProduct = (req, res) => {
  let ProductID = req.params.ProductID;
  Product.findById(ProductID).then((products) => {
    console.log(products);
    res.render('productpage', {
      data: {
        title: products.title,
        result : products
      }
    });
  });
};