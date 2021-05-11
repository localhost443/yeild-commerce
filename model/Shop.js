'use strict';
//initiating mongoose
const Mongoose = require('mongoose');
const Schema = Mongoose.Schema;

const ShopSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  bannerImage: {
    type: String,
    required: false,
  },
  logs: [],
});

module.exports = Mongoose.model('Shop', ShopSchema);
