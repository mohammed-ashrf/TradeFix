const express = require('express');
const router = express.Router();

const deviceController = require('../controllers/device.controller');
const repairController = require('../controllers/repair.controller');

router.get('/devices', deviceController.getDevices);
router.get('/devices/:id', deviceController.getDeviceById);
router.delete('/devices/:id', deviceController.deleteDeviceById);
router.put('/devices/:id', deviceController.updateDeviceById);
router.post('/devices', deviceController.createDevice);

router.get('/repairs', repairController.getRepairs);
router.post('/repairs', repairController.createRepair);


module.exports = router;