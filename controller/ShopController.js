'use strict';
const User = require('../model/User');
const Product = require('../model/Product');
const Shop = require('../model/Shop');
exports.shop = (req, res) => {
  let userCanDelete = false;
  if (req.user) if (req.user.shopName) userCanDelete = req.user.shopName;
  Product.find().then((products) => {
    // console.log(req.user);
    // console.log(products);
    res.render('shop', {
      data: {
        title: 'Shop Page',
        products,
        user: userCanDelete,
      },
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
        result: products,
      },
    });
  });
};

exports.createShop = (req, res) => {
  let userCanDelete = false;
  if (req.user) if (req.user.shopName) userCanDelete = req.user.shopName;
  let isShopAvailable = req.user.isReallyShopOwner();
  if (req.method === 'GET') {
    let usershopid = req.user.shopName;
    if (usershopid) {
      Product.find({ shopName: usershopid }).then((products) => {
        return res.render('user/shop', {
          data: {
            title: 'Your Personal Shop',
            products: products,
            user: userCanDelete,
          },
        });
      });
    }
    if (isShopAvailable === false) {
      req.flash(
        'info',
        'Shop functions is not available for you, Please register as shop owner'
      );
      return res.redirect('/shop');
    } else if (isShopAvailable) {
      if (isShopAvailable.shopOwner === false) {
        res.render('user/shopRegister', {
          data: {
            title: 'Register Your Shop',
          },
        });
      }
    }
  }
  if (req.method === 'POST') {
    if (req.user.shopName) res.redirect('/yourshop');
    let name = req.body.shopname;
    let shop = new Shop({
      name: name,
    });
    shop
      .save()
      .then((data) => {
        req.user.assignShop(data._id);
      })
      .then(() => {
        req.flash(
          'info',
          'Yoo! Your Shop has been created, Now you can start adding and selling products'
        );
        return res.redirect('/yourshop/');
      })
      .catch((err) => console.log(err));
    console.log(shop);
  }
};
