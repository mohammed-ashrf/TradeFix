const express = require('express');
const router = express.Router();

const deviceController = require('../controllers/device.controller');

router.get('/', deviceController.getDevices);
router.get('/:id', deviceController.getDeviceById);
router.delete('/:id', deviceController.deleteDeviceById);
router.put('/:id', deviceController.updateDeviceById);
router.post('/', deviceController.createDevice);


module.exports = router;