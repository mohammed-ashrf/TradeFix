const mongoose = require('mongoose');

const partSchema = new mongoose.Schema({
  name: { type: String, required: true },
  quantity: { type: Number, required: true },
  manufacturer: { type: String }
});

const inventoryDeviceSchema = new mongoose.Schema({
  type: { type: String, required: true },
  serialNumber: { type: String, required: true },
  manufacturer: { type: String },
  purchaseDate: { type: Date },
  warrantyExpirationDate: { type: Date },
  parts: [partSchema]
});

module.exports = mongoose.model('InventoryDevice', inventoryDeviceSchema);