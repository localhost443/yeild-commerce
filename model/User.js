'use strict';
const Mongoose = require('mongoose');
const Schema = Mongoose.Schema;
const UserSchema = new Schema({
  name: {
    type: String,
    require: true
  },
  username: {
    type: String,
    require: true
  },
  email: {
    type: String,
    require: true
  },
  password: {
    type: String,
    require: true
  },
  role : {
    type: String,
    default: 'subscriber'
  },
  cart: {
    items: [
      {
        productId: { type: Schema.Types.ObjectId, ref: 'Product', require: true },
        quantity: { type: Number, require: true }
      }
    ]
  },
  orders: {
    items: [ {
      productId: { type: Schema.Types.ObjectId, ref: 'Product', require: true },
      quantity: { type: Number, require: true }
      }
    ]
  }
});
UserSchema.methods.addToCart = function(productId, q = 1) {
  let isFoundInProducts = false;
  let z = this.cart.items.map((data, index) => {
    if (data.productId.toString() === productId.toString()) {
      data.quantity = data.quantity + q;
      isFoundInProducts = true;
      return data;
    } else {
      return data;
    }
  });
  if (!isFoundInProducts) {
    z.push({
      productId: Mongoose.Types.ObjectId(productId),
      quantity: q
    });
  }
  this.cart.items = z;
  this.save();
};

UserSchema.methods.getCart = function (req, res) {
  res.end("data Recieved");
}

module.exports = Mongoose.model('User', UserSchema);