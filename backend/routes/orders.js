const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Product = require('../models/Product');
const { protect, authorize } = require('../middleware/auth');

// POST /api/orders - Buyer order करतो
router.post('/', protect, authorize('buyer'), async (req, res) => {
  try {
    const { items, deliveryAddress, paymentMethod } = req.body;
    let totalAmount = 0;

    const orderItems = [];
    for (const item of items) {
      const product = await Product.findById(item.productId).populate('farmer', 'name farmerId');
      if (!product || !product.isAvailable || product.availableQty < item.quantity) {
        return res.status(400).json({ message: `${product?.name || 'Product'} उपलब्ध नाही` });
      }
      const itemTotal = product.price * item.quantity;
      totalAmount += itemTotal;
      orderItems.push({
        product: product._id,
        farmer: product.farmer._id,
        productName: product.name,
        quantity: item.quantity,
        unit: product.unit,
        pricePerUnit: product.price,
        totalPrice: itemTotal
      });
      // Stock कमी करा
      product.availableQty -= item.quantity;
      await product.save();
    }

    const deliveryCharge = totalAmount > 500 ? 0 : 30;
    const grandTotal = totalAmount + deliveryCharge;

    const order = await Order.create({
      buyer: req.user._id,
      items: orderItems,
      totalAmount,
      deliveryCharge,
      grandTotal,
      deliveryAddress,
      paymentMethod,
      expectedDelivery: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days
      statusHistory: [{ status: 'pending', note: 'Order placed', updatedBy: req.user._id }]
    });

    // Real-time notification
    const io = req.app.get('io');
    orderItems.forEach(item => {
      io.to(item.farmer.toString()).emit('new-order', { orderId: order.orderId, message: 'नवीन order आला!' });
    });

    await order.populate('buyer', 'name phone');
    res.status(201).json({ success: true, message: 'Order यशस्वी!', order });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/orders/my-orders - Buyer चे orders
router.get('/my-orders', protect, authorize('buyer'), async (req, res) => {
  try {
    const orders = await Order.find({ buyer: req.user._id })
      .populate('items.product', 'name images')
      .populate('deliveryBoy', 'name phone vehicleNumber')
      .sort({ createdAt: -1 });
    res.json({ success: true, orders });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/orders/farmer-orders - Farmer चे orders
router.get('/farmer-orders', protect, authorize('farmer'), async (req, res) => {
  try {
    const orders = await Order.find({ 'items.farmer': req.user._id })
      .populate('buyer', 'name phone')
      .populate('deliveryBoy', 'name phone')
      .sort({ createdAt: -1 });
    res.json({ success: true, orders });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/orders/delivery-orders - Delivery boy चे orders
router.get('/delivery-orders', protect, authorize('delivery'), async (req, res) => {
  try {
    const orders = await Order.find({ deliveryBoy: req.user._id })
      .populate('buyer', 'name phone deliveryAddress')
      .populate('items.product', 'name')
      .sort({ createdAt: -1 });
    res.json({ success: true, orders });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT /api/orders/:id/status - Status update (farmer, delivery, admin)
router.put('/:id/status', protect, async (req, res) => {
  try {
    const { status, note } = req.body;
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order सापडला नाही' });

    // Permission check
    const allowedTransitions = {
      farmer: { pending: 'confirmed', confirmed: 'packed' },
      delivery: { packed: 'picked_up', picked_up: 'in_transit', in_transit: 'delivered' },
      admin: { pending: 'confirmed', confirmed: 'packed', packed: 'picked_up', in_transit: 'delivered' },
      buyer: { pending: 'cancelled' }
    };

    const transitions = allowedTransitions[req.user.role];
    if (!transitions || transitions[order.status] !== status) {
      return res.status(403).json({ message: 'हा status change करता येणार नाही' });
    }

    order.status = status;
    order.statusHistory.push({ status, note, updatedBy: req.user._id });
    if (status === 'delivered') order.deliveredAt = new Date();
    await order.save();

    // Notify buyer
    const io = req.app.get('io');
    io.to(order.buyer.toString()).emit('order-updated', {
      orderId: order.orderId,
      status,
      message: `तुमचा order ${status} झाला!`
    });

    res.json({ success: true, message: 'Status update झाला', order });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/orders/:id
router.get('/:id', protect, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('buyer', 'name phone')
      .populate('deliveryBoy', 'name phone vehicleNumber')
      .populate('items.product', 'name images')
      .populate('items.farmer', 'name farmName farmerId phone');
    if (!order) return res.status(404).json({ message: 'Order सापडला नाही' });
    res.json({ success: true, order });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
