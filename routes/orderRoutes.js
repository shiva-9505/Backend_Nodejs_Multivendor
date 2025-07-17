const express = require('express');
const orderController = require('../controllers/orderController');
const router = express.Router();

router.post('/place-order', orderController.placeOrder);
router.get('/all-orders', orderController.getAllOrders);
router.get('/firmorder/:firmId', orderController.getOrdersByFirm);

router.get('/vendororder/:firmId',orderController.getOrdersForVendor);
router.patch('/status/:orderId',orderController.updateOrderStatus)

module.exports = router; 