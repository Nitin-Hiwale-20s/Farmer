const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const User = require('../models/User');
const { protect, authorize } = require('../middleware/auth');

// GET /api/delivery/available-orders - Packed orders जे assign नाहीत
router.get('/available-orders', protect, authorize('delivery'), async (req, res) => {
  try {
    const orders = await Order.find({ status: 'packed', deliveryBoy: null })
      .populate('buyer', 'name phone deliveryAddress')
      .populate('items.product', 'name');
    res.json({ success: true, orders });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT /api/delivery/accept/:orderId - Delivery boy order accept करतो
router.put('/accept/:orderId', protect, authorize('delivery'), async (req, res) => {
  try {
    const order = await Order.findById(req.params.orderId);
    if (!order || order.deliveryBoy) {
      return res.status(400).json({ message: 'Order उपलब्ध नाही' });
    }
    order.deliveryBoy = req.user._id;
    order.status = 'picked_up';
    order.statusHistory.push({ status: 'picked_up', note: 'Delivery boy ने घेतले', updatedBy: req.user._id });
    await order.save();
    res.json({ success: true, message: 'Order accept केला!', order });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/delivery/my-deliveries
router.get('/my-deliveries', protect, authorize('delivery'), async (req, res) => {
  try {
    const orders = await Order.find({ deliveryBoy: req.user._id })
      .populate('buyer', 'name phone')
      .sort({ createdAt: -1 });
    res.json({ success: true, orders });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT /api/delivery/toggle-availability
router.put('/toggle-availability', protect, authorize('delivery'), async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    user.isAvailable = !user.isAvailable;
    await user.save();
    res.json({ success: true, isAvailable: user.isAvailable });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
