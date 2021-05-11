const express = require('express');
const app = express.Router();
const ShopController = require('./../controller/ShopController');


// app.get('/', ShopController.index);
app.get('/shop', ShopController.shop);
app.get('/product/:ProductID', ShopController.SingleProduct);

module.exports = app;
