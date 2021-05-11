'use strict';
//initiating mongoose
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ShopSchema = new Schema({
  name : {
    type: String,
    required : true
  },
  userList : {
    Users : [
      {
        User: { type: Schema.Types.ObjectId, ref: 'User', require: true },
      }
    ]
  },
  logs : []
});