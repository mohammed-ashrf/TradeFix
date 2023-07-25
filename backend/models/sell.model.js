const mongoose = require('mongoose');

const CartItem = new mongoose.Schema({
    product: {
        name: { type: String, required: true, unique: true},
        description: { type: String },
        purchasePrice: { type: Number, required: true },
        deallerSellingPrice: { type: Number, required: true },
        deallerSellingPriceAll: { type: Number, required: true },
        userSellingPrice: { type: Number, required: true },
        category: { type: String, required: true },
        quantity: { type: Number, default: 0 },
        quantitySold: {type: Number, required: false},
        purchasedate: { type: String, required: true},
        sellingdate: { type: String, required: false},
        supplier: {type: String, required: false},
        whatIsPaid: {type: Number, required: true},
        oweing: {type: Number, required: true},
    },
    quantity: {type: Number, required: true},
    totalPrice: {type: Number, required: true},
});

const soldCartSchema = new mongoose.Schema({
    cartName: {type: String, required: true},
    buyerName: {type: String, required: false},
    PhoneNumber: {type: String, required: false},
    totalPrice: {type: Number, required: true},
    discount: {type: Number, required: true},
    pastOwing: {type:Number, required: false},
    total: {type:Number, required: true},
    paid: {type: Number, required: true},
    owing: {type: Number, required: true},
    sellerName: {type: String, required: true},
    payType: {type: String, required: true},
    buyerType: {type: String, required: true},
    date: {type: Date, default: Date.now},
    products:[CartItem],
});

const buyerSchema = new mongoose.Schema({
    buyerName: {type: String, required: false},
    PhoneNumber: {type: String, required: false},
    carts: [soldCartSchema],
})

const SoldCart = mongoose.model('SoldCart', soldCartSchema);
const Buyer = mongoose.model('Buyer', buyerSchema);

module.exports = {
   SoldCart,
   Buyer
};