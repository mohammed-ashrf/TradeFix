const express = require('express');
const router = express.Router();

const deviceController = require('../controllers/device.controller');
const repairController = require('../controllers/repair.controller');
const inventoryController = require('../controllers/inventory.controller');
const productController = require('../controllers/product.controller');
const informationController = require('../controllers/information.controller');
const cartController = require('../controllers/sell.controller');

router.get('/devices', deviceController.getDevices);
router.get('/devices/:id', deviceController.getDeviceById);
router.delete('/devices/:id', deviceController.deleteDeviceById);
router.put('/devices/:id', deviceController.updateDeviceById);
router.post('/devices', deviceController.createDevice);

router.get('/repairs', repairController.getRepairs);
router.post('/repairs', repairController.createRepair);


router.get('/inventory', inventoryController.getInventory);
router.post('/inventory', inventoryController.addInventory);
router.put('/inventory/:id', inventoryController.updateInventory);
router.delete('/inventory/:id', inventoryController.removeInventory);

router.get('/products', productController.getProducts);
router.post('/products', productController.createProduct);
router.post('/products/purchase', productController.purchaseProducts);
router.get('/products/search', productController.searchProducts);

// Sections API
router.get('/sections', informationController.getSections);
router.get('/sections/:id', informationController.getSectionById);
router.post('/sections', informationController.createSection);
router.put('/sections/:id', informationController.updateSection);
router.delete('/sections/:id', informationController.deleteSection);

// Suppliers API
router.get('/suppliers', informationController.getSuppliers);
router.get('/suppliers/:id', informationController.getSupplierById);
router.post('/suppliers', informationController.createSupplier);
router.put('/suppliers/:id', informationController.updateSupplier);
router.delete('/suppliers/:id', informationController.deleteSupplier);
// Dealers API
router.get('/dealers', informationController.getDealers);
router.get('/dealers/:id', informationController.getDealerById);
router.post('/dealers', informationController.createDealer);
router.put('/dealers/:id', informationController.updateDealer);
router.delete('/dealers/:id', informationController.deleteDealer);

// Dollar prices API
router.get('/dollar-price', informationController.getDollarPrice);
router.get('/dollar-price/:id', informationController.getDollarPriceById);
router.post('/dollar-price', informationController.createDollarPrice);
router.put('/dollar-price/:id', informationController.updateDollarPrice);
router.delete('/dollar-price/:id', informationController.deleteDollarPrice);

// Sold Carts API
router.get('sold-carts', cartController.getSoldCarts);
router.get('/sold-carts/:id', cartController.getSoldCartById);
router.delete('/sold-carts/:id', cartController.deleteSoldCartById);
router.put('/sold-carts/:id', cartController.updateSoldCartById);
router.post('/sold-carts', cartController.sellCart);


module.exports = router;