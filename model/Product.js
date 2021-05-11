'use strict';
//initiating mongoose
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const ProductSchema = new Schema({
  title: {
    type : String,
    required : true
  },
  price : {
    type : Number,
    required : true
  },
  description: String,
  imageURL : String,
  user : {
    type : Schema.Types.ObjectId,
    ref : 'User',
    required: true
  },
  shopName : {
    type : Schema.Types.ObjectId,
    required : true
  }
});

module.exports = mongoose.model('Product', ProductSchema)