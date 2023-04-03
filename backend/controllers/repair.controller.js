const Repair = require('../models/repair.model');

exports.getRepairs = async function (req, res) {
  try {
    const repairs = await Repair.find();
    res.json(repairs);
  } catch (error) {
    console.error('Failed to get repairs:', error.message);
    res.status(500).json({ message: 'Failed to get repairs' });
  }
};

exports.createRepair = async function (req, res) {
  try {
    const { device, customer, technician, description } = req.body;

    if (!device || !customer || !technician || !description) {
      return res.status(400).json({ message: 'Device, customer, technician, and description are required' });
    }

    const repair = new Repair({ device, customer, technician, description });
    const savedRepair = await repair.save();

    res.status(201).json(savedRepair);
  } catch (error) {
    console.error('Failed to create repair:', error.message);
    res.status(500).json({ message: 'Failed to create repair' });
  }
};