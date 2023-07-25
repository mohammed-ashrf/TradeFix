const Device = require('../models/device.model');

exports.getDevices = async function (req, res) {
  try {
    const devices = await Device.find();
    res.json(devices);
  } catch (error) {
    console.error('Failed to get devices:', error.message);
    res.status(500).json({ message: 'Failed to get devices' });
  }
};

exports.getDeviceById = async function (req, res) {
  try {
    const device = await Device.findById(req.params.id);
    res.json(device);
  } catch (error) {
    console.error('Failed to get device:', error.message);
    res.status(500).json({ message: 'Failed to get device' });
  }
};

exports.updateDeviceById = async function (req, res) {
  try {
    const device = await Device.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(device);
  } catch (error) {
    console.error('Failed to update device:', error.message);
    res.status(500).json({ message: 'Failed to update device' });
  }
};

exports.deleteDeviceById = async function (req, res) {
  try {
    const device = await Device.findByIdAndDelete(req.params.id);
    if (!device) {
      return res.status(404).json({ message: 'Device not found' });
    }
    res.json({ message: 'Device deleted successfully' });
  } catch (error) {
    console.error('Failed to delete device:', error.message);
    res.status(500).json({ message: 'Failed to delete device' });
  }
};

exports.createDevice = async function (req, res) {
  try {
    const { clientName, telnum,deviceType,section,engineer,priority,clientSelection,complain,repair, products,notes,fees,finished, receivingDate, repaired, paidAdmissionFees, delivered, returned } = req.body;

    if (!clientName) {
      return res.status(400).json({ message: 'Name is required required' });
    }
    
    const device = new Device({ clientName, telnum,deviceType,section,engineer,priority,clientSelection,complain,repair, products,notes,fees,finished,receivingDate, repaired, paidAdmissionFees, delivered, returned});
    const savedDevice = await device.save();
    res.status(201).json(savedDevice);
  } catch (error) {
    console.error('Failed to create device:', error.message);
    res.status(500).json({ message: 'Failed to create device' });
  }
};