'use strict';
const Product = require('../model/Product');
/**
 * This is the AddProduct function that normally execute addProduct
 * req : the request object
 * res : the response object
 * @param {*} req
 * @param {*} res
 */
exports.addProduct = (req, res) => {
  res.render('admin/add-product', {
    data: {
      title: 'Add new product',
      url: 'admin/add-product'
    }
  });
};

exports.addProductPost = (req, res) => {
  let r = req.body;
  let z = new Product({
    title: r.name,
    price: r.price,
    description: r.description,
    imageURL: r.imageURL,
    user : req.user
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
  Product.find()
    //.select can be able to select file _HHEHEHEHEHE
    .populate('user', 'name')
    .then((product) => {
    console.log(product);
    res.render('admin/productlist', {
      data: {
        title: 'Product Listing',
        products: product
      }
    });
  });
};

exports.editProduct = (req, res) => {
  const pid = req.params.productId;
  console.log(pid);
  Product.findById(pid).then((result) => {
    res.render('admin/edit-product', {
        data: {
          title: 'Edit your product',
          result,
        }
      }
    );
  }).catch((err) => console.log(err));
};

exports.saveEditedProduct = (req, res) => {
  console.log(req.body);
  Product.findById(req.body._id).then((product) => {
    console.log(product);
    product.title = req.body.name;
    product.price = req.body.price;
    product.description = req.body.description;
    product.imageURL = req.body.imageURL;
    product.user = req.user;
    return product.save();
  })
    .then(() => {
        console.log('Product Saved');
        res.redirect('#');
      })
    .catch((err) => console.log('Product saving failed', err));
};

exports.deleteProduct = (req, res) => {
  const pid = req.params.productId;
  Product.findByIdAndRemove(pid).then(() => {
    res.redirect('/shop/');
  });
};