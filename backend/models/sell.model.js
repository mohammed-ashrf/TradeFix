const mongoose = require('mongoose');

const sellSchema = new mongoose.Schema({
    type: {type: String, required: true},
    buyerName: {type: String, required: false},
    number: {type: String, required: false},
    product: {type: String, required: true},
    quantity: {type: Number, required: true},
    itemPrice: {type: Number, required: true},
    totalPrice: {type: Number, required: true},
    paid: {type: Number, required: true},
    Owing: {type: Number, required: true},
    date: {type: Date, default: Date.now},
});

module.exports = mongoose.model('Sell', sellSchema);