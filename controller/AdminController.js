'use strict';
const Product = require('../model/Product');
const User = require('../model/User');
/**
 * This is the AddProduct function that normally execute addProduct
 * req : the request object
 * res : the response object
 * @param {*} req
 * @param {*} res
 */
exports.addProduct = (req, res) => {
  let hasShop = req.user.hasShop();
  if (!hasShop) {
    req.flash('info', "You don't have a shop, Please create one first");
    return res.redirect('/shop');
  }
  res.render('admin/add-product', {
    data: {
      title: 'Add new product',
      url: 'admin/add-product',
    },
  });
};

exports.addProductPost = (req, res) => {
  let hasShop = req.user.hasShop();
  if (!hasShop) {
    req.flash('info', "You don't have a shop, Please create one first");
    return res.redirect('/shop');
  }
  let r = req.body;
  let z = new Product({
    title: r.name,
    price: r.price,
    description: r.description,
    imageURL: r.imageURL,
    user: req.user,
    shopName: hasShop,
  });
  z.save()
    .then(() => {
      console.log('Product Created');
      res.redirect('/shop/');
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.list = (req, res) => {
  let user = req.user ?? false;
  console.log(user);
  Product.find()
    //.select can be able to select file _HHEHEHEHEHE
    .populate('user', 'name')
    .then((product) => {
      res.render('admin/productlist', {
        data: {
          title: 'Product Listing',
          products: product,
          user: user,
        },
      });
    });
};

exports.editProduct = (req, res) => {
  const pid = req.params.productId;
  let userCanDelete = false;
  if (req.user) if (req.user.shopName) userCanDelete = req.user.shopName;
  if (res.session) console.log(pid);
  Product.findById(pid)
    .then((result) => {
      if (result) {
        if (result.shopName.toString() === userCanDelete.toString()) {
          res.render('admin/edit-product', {
            data: {
              title: 'Edit your product',
              result,
            },
          });
        } else {
          req.flash(
            'info',
            "You don't have permission to do that action, I am sorry man :'( "
          );
          return res.redirect('/shop/');
        }
      } else {
        req.flash(
          'info',
          "You don't have permission to do that action, I am sorry man :'( "
        );
        return res.redirect('/shop/');
      }
    })
    .catch((err) => console.log(err));
};

exports.saveEditedProduct = (req, res) => {
  let userCanDelete = false;
  if (req.user) if (req.user.shopName) userCanDelete = req.user.shopName;
  Product.findById(req.body._id)
    .then((product) => {
      if (product) {
        if (product.shopName.toString() === userCanDelete.toString()) {
          product.title = req.body.name;
          product.price = req.body.price;
          product.description = req.body.description;
          product.imageURL = req.body.imageURL;
          product.user = req.user;
          return product.save().then((data) => {
            console.log(data);
            req.flash(
              'info',
              `Cogratulation, Your product has been Updated <a href='/product/${data._id}'> <span class='text-blue-800 font-bold'> View Product</span> </a> `
            );
            return res.redirect('/yourshop/');
          });
        } else {
          req.flash(
            'info',
            "You don't have permission to edit this product sir :'( "
          );
          return res.redirect('/shop/');
        }
      } else {
        req.flash(
          'info',
          "You don't have permission to edit this product sir :'( "
        );
        return res.redirect('/shop/');
      }
    })
    .catch((err) => console.log('Product saving failed', err));
};

exports.deleteProduct = (req, res) => {
  const pid = req.params.productId;
  let userCanDelete = false;
  if (req.user) if (req.user.shopName) userCanDelete = req.user.shopName;
  Product.findById(pid)
    .then((product) => {
      if (product.shopName) {
        if (product.shopName.toString() === userCanDelete.toString()) {
          Product.findByIdAndRemove(pid).then(() => {
            req.flash('info', 'Congratulation, Your product has been deleted');
            return res.redirect('/yourshop');
          });
        } else {
          req.flash('info', "Sorry man, You don't have this permission");
          return res.redirect('/shop');
        }
      } else {
        req.flash('info', "Sorry man, You don't have this permission");
        return res.redirect('/shop');
      }
    })
    .catch((err) => console.log(err));
};
