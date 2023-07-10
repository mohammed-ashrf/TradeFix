const deviceModel = require('../models/inventory.model');

// Add a new device to inventory
exports.addInventory = async (req, res) => {
    try {
      const { type, serialNumber, manufacturer, purchaseDate, warrantyExpirationDate, parts } = req.body;
  
      if (!type || !serialNumber) {
        return res.status(400).json({ message: 'Type and serial number are required' });
      }
  
      const newDevice = new inventoryDeviceModel({
        type,
        serialNumber,
        manufacturer,
        purchaseDate,
        warrantyExpirationDate,
        parts
      });
  
      const savedDevice = await newDevice.save();
  
      res.status(201).json(savedDevice);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
};
  
// Update an existing device in inventory
exports.updateInventory = async (req, res) => {
    try {
      const device = await deviceModel.findById(req.params.id);
      if (device == null) {
        return res.status(404).json({ message: 'Device not found' });
      }
      if (req.body.type != null) {
        device.type = req.body.type;
      }
      if (req.body.serialNumber != null) {
        device.serialNumber = req.body.serialNumber;
      }
      if (req.body.manufacturer != null) {
        device.manufacturer = req.body.manufacturer;
      }
      if (req.body.purchaseDate != null) {
        device.purchaseDate = req.body.purchaseDate;
      }
      if (req.body.warrantyExpirationDate != null) {
        device.warrantyExpirationDate = req.body.warrantyExpirationDate;
      }
      if (req.body.parts != null) {
        device.parts = req.body.parts;
      }
      const updatedDevice = await device.save();
      res.json(updatedDevice);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
};
  
// Remove a device from inventory
exports.removeInventory = async (req, res) => {
    try {
        const device = await deviceModel.findById(req.params.id);
        if (device == null) {
        return res.status(404).json({ message: 'Device not found' });
        }
        await device.remove();
        res.json({ message: 'Device removed' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.getInventory = async (req, res) => {
    try {
      const devices = await deviceModel.find();
      res.status(200).json(devices);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
};