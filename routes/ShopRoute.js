const express = require('express');
const app = express.Router();
const ShopController = require('./../controller/ShopController');
const auth = require('../Middleware/authenticator');

// app.get('/', ShopController.index);
app.get('/shop', ShopController.shop);
app.get('/product/:ProductID', ShopController.SingleProduct);
app.get('/createshop', auth.needLoggedIn, ShopController.createShop);
app.post('/createshop', auth.needLoggedIn, ShopController.createShop);

module.exports = app;
