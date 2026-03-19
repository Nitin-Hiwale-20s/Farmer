const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Product = require('../models/Product');
const Order = require('../models/Order');
const { protect, authorize } = require('../middleware/auth');

const adminOnly = [protect, authorize('admin')];

// GET /api/admin/dashboard
router.get('/dashboard', ...adminOnly, async (req, res) => {
  try {
    const [totalFarmers, totalBuyers, totalDelivery, totalProducts, totalOrders, pendingProducts, pendingOrders] = await Promise.all([
      User.countDocuments({ role: 'farmer' }),
      User.countDocuments({ role: 'buyer' }),
      User.countDocuments({ role: 'delivery' }),
      Product.countDocuments(),
      Order.countDocuments(),
      Product.countDocuments({ isApproved: false }),
      Order.countDocuments({ status: 'pending' })
    ]);

    const revenueData = await Order.aggregate([
      { $match: { status: 'delivered' } },
      { $group: { _id: null, total: { $sum: '$grandTotal' } } }
    ]);

    res.json({
      success: true,
      stats: {
        totalFarmers, totalBuyers, totalDelivery,
        totalProducts, totalOrders,
        pendingProducts, pendingOrders,
        totalRevenue: revenueData[0]?.total || 0
      }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/admin/users
router.get('/users', ...adminOnly, async (req, res) => {
  try {
    const { role } = req.query;
    const query = role ? { role } : {};
    const users = await User.find(query).select('-password').sort({ createdAt: -1 });
    res.json({ success: true, users });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT /api/admin/users/:id/verify - Farmer verify करा
router.put('/users/:id/verify', ...adminOnly, async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, { isVerified: true }, { new: true });
    res.json({ success: true, message: 'User verified!', user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT /api/admin/users/:id/toggle-active
router.put('/users/:id/toggle-active', ...adminOnly, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    user.isActive = !user.isActive;
    await user.save();
    res.json({ success: true, message: `User ${user.isActive ? 'activate' : 'block'} केला`, user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT /api/admin/products/:id/approve - Product approve करा
router.put('/products/:id/approve', ...adminOnly, async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, { isApproved: true }, { new: true });
    res.json({ success: true, message: 'Product approved!', product });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/admin/products/pending
router.get('/products/pending', ...adminOnly, async (req, res) => {
  try {
    const products = await Product.find({ isApproved: false }).populate('farmer', 'name farmerId farmName');
    res.json({ success: true, products });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/admin/orders - सर्व orders
router.get('/orders', ...adminOnly, async (req, res) => {
  try {
    const { status } = req.query;
    const query = status ? { status } : {};
    const orders = await Order.find(query)
      .populate('buyer', 'name phone')
      .populate('deliveryBoy', 'name phone')
      .sort({ createdAt: -1 });
    res.json({ success: true, orders });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT /api/admin/orders/:id/assign-delivery
router.put('/orders/:id/assign-delivery', ...adminOnly, async (req, res) => {
  try {
    const { deliveryBoyId } = req.body;
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { deliveryBoy: deliveryBoyId },
      { new: true }
    ).populate('deliveryBoy', 'name phone');
    res.json({ success: true, message: 'Delivery boy assign केला', order });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
