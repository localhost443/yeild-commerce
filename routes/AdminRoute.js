const express = require('express');
const router = express.Router();
const dir = require('../helper/dir');
const admincontroller = require('./../controller/AdminController');


router.get('/list', admincontroller.list);
router.get('/add-product', admincontroller.addProduct);
router.post('/add-product', admincontroller.addProductPost);

router.get('/delete/:productId', admincontroller.deleteProduct);


router.get('/edit/:productId', admincontroller.editProduct);
router.post('/edit/:productId', admincontroller.saveEditedProduct);

module.exports = router;
