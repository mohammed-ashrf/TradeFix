const mongoose = require('mongoose');

const sectionSchema = new mongoose.Schema({
    name: { type: String, unique: true, required: true },
    checkingFees: {type: Number},
    description: { type: String },
});
const productSectionSchema = new mongoose.Schema({
    name: { type: String, unique: true, required: true },
    description: { type: String },
})

const supplierSchema = new mongoose.Schema({
    name: { type: String, required: true },
    companyName: {type: String},
    phone: { type: String},
    notes: {type: String},
})
const dealerSchema = new mongoose.Schema({
    name: { type: String, required: true },
    companyName: { type: String},
    email: { type: String, unique: true, required: false },
    phone: { type: String },
    notes: { type: String },
});

const dollarPriceSchema = new mongoose.Schema({
    price: { type: Number, required: true },
    date: { type: Date, default: Date.now },
});

const Section = mongoose.model('Section', sectionSchema);
const ProductSection = mongoose.model('ProductSection', productSectionSchema)
const Supplier = mongoose.model('Supplier', supplierSchema)
const Dealer = mongoose.model('Dealer', dealerSchema);
const DollarPrice = mongoose.model('DollarPrice', dollarPriceSchema);

module.exports = {
  Section,
  ProductSection,
  Supplier,
  Dealer,
  DollarPrice,
};