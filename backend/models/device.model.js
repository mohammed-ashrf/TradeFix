const mongoose = require('mongoose');

const deviceSchema = new mongoose.Schema({
  clientName: { type: String, required: true },
  telnum: { type: String, required: true },
  deviceType: { type: String, required: true },
  section: { type: String, required: true },
  clientSelection: { type: String, required: true },
  complain: { type: String, required: true },
  notes: { type: String, required: false },
  fees: { type: Number, required: true },
  finished: { type: Boolean, required: false },
  receivingDate: { type: String, required: true },
});

module.exports = mongoose.model('Device', deviceSchema);