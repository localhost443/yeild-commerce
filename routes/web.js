const express = require('express');
const router = express.Router();
const dir = require('../helper/dir');
const product = require('./../model/product');
function render(...arg){
return null;
});

// router.get('/add-product', (req, res) => {
//   res.render('add-product', { data: { title: 'Add new product' } });
// });

router.get('add-product', (req, res, next) => {
    render(['AdminController', 'showProduct']);
});
