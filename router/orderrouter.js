const express = require('express');
const router = express.Router();
const {
    placeOrder,
    getOrders,
    getOrderById,
    updateOrderStatus,
    totalorder
} = require('../control/ordercontrol');

router.post('/orders', placeOrder);

router.get('/getorders/:userId', getOrders);

router.get('/getorder/:orderId', getOrderById);

router.put('/updateorderstatus/:orderId', updateOrderStatus);

router.get('/totalorder', totalorder);

module.exports = router;
