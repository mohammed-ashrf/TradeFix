// models/product.model.js

const mongoose = require('mongoose');

const buyer = new mongoose.Schema({
  type: {type: String, required: false},
  name: {type:String, required: false},
  number: {type: String, required: false},
  product: {type: String, required: false},
  quantity: {type: Number, required: false},
  itemPrice: {type: Number, required: false},
  totalPrice: {type: Number, required: false},
  paid: {type: Number, required: false},
  Oweing: {type: Number, required: false},
  sellerName: {type: String, required: false},
  date: {type: Date, default: Date.now},
});

const productSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true},
  description: { type: String },
  purchasePrice: { type: Number, required: true },
  deallerSellingPrice: { type: Number, required: true },
  deallerSellingPriceAll: { type: Number, required: true },
  userSellingPrice: { type: Number, required: true },
  category: { type: String, required: true },
  quantity: { type: Number, default: 0 },
  quantityToSell: {type: Number, required: false},
  purchasedate: { type: String, required: true},
  sellingdate: { type: String, required: false},
  supplier: {type: String, required: false},
  whatIsPaid: {type: Number, required: true},
  oweing: {type: Number, required: true},
  buyers: [buyer],
});

module.exports = mongoose.model('Product', productSchema);