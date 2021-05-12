const express = require('express');
const router = express.Router();
const dir = require('../helper/dir');
const admincontroller = require('./../controller/AdminController');
const User = require('../Middleware/authenticator');

router.get('/list', admincontroller.list);
//Add Products Routes goes here
router.get('/add-product', admincontroller.addProduct);
router.post('/add-product', admincontroller.addProductPost);
//Edit products routes goes here
router.get('/edit/:productId', User.needLoggedIn, admincontroller.editProduct);
router.post(
  '/edit/:productId',
  User.needLoggedIn,
  admincontroller.saveEditedProduct
);

router.get('/delete/:productId', admincontroller.deleteProduct);

module.exports = router;
