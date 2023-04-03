const mongoose = require('mongoose');

const repairSchema = new mongoose.Schema({
  device: { type: mongoose.Schema.Types.ObjectId, ref: 'Device', required: true },
  customer: { type: String, required: true },
  technician: { type: String, required: true },
  description: { type: String, required: true },
});

module.exports = mongoose.model('Repair', repairSchema);