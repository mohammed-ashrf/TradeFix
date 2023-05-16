const mongoose = require('mongoose');

const deviceSchema = new mongoose.Schema({
  clientName: { type: String, required: true },
  telnum: { type: String, required: true },
  deviceType: { type: String, required: true },
  section: { type: String, required: true },
  engineer: { type: String, required: false},
  priority: { type: String, required: false},
  clientSelection: { type: String, required: true },
  complain: { type: String, required: true },
  repair: { type: String, required: false },
  notes: { type: String, required: false },
  fees: { type: Number, required: true },
  finished: { type: Boolean, required: false },
  receivingDate: { type: String, required: true },
  repaired: { type: Boolean, required: false },
  paidAdmissionFees: { type: Boolean, required: false },
  delivered: { type: Boolean, required: false },
  returned: { type: Boolean, required: false },
});

module.exports = mongoose.model('Device', deviceSchema);