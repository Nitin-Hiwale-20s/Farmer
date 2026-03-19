const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const { protect, authorize } = require('../middleware/auth');

// GET /api/products - सर्व products (buyers साठी)
router.get('/', async (req, res) => {
  try {
    const { category, search, minPrice, maxPrice, organic, sort } = req.query;
    let query = { isAvailable: true, isApproved: true, availableQty: { $gt: 0 } };

    if (category) query.category = category;
    if (organic === 'true') query.isOrganic = true;
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }
    if (search) query.$text = { $search: search };

    let sortObj = { createdAt: -1 };
    if (sort === 'price_low') sortObj = { price: 1 };
    if (sort === 'price_high') sortObj = { price: -1 };
    if (sort === 'rating') sortObj = { rating: -1 };

    const products = await Product.find(query)
      .populate('farmer', 'name farmName farmLocation farmerId rating')
      .sort(sortObj);

    res.json({ success: true, count: products.length, products });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/products/:id
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('farmer', 'name farmName farmLocation farmerId rating phone');
    if (!product) return res.status(404).json({ message: 'Product सापडला नाही' });
    product.views += 1;
    await product.save();
    res.json({ success: true, product });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/products - Farmer नवीन product टाकतो
router.post('/', protect, authorize('farmer'), async (req, res) => {
  try {
    const product = await Product.create({
      ...req.body,
      farmer: req.user._id,
      farmerId: req.user.farmerId
    });
    res.status(201).json({ success: true, message: 'Product add केला! Admin approval pending.', product });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT /api/products/:id - Farmer product update करतो
router.put('/:id', protect, authorize('farmer'), async (req, res) => {
  try {
    const product = await Product.findOne({ _id: req.params.id, farmer: req.user._id });
    if (!product) return res.status(404).json({ message: 'Product सापडला नाही किंवा तुमचा नाही' });

    Object.assign(product, req.body);
    await product.save();
    res.json({ success: true, message: 'Product update झाला', product });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE /api/products/:id
router.delete('/:id', protect, authorize('farmer', 'admin'), async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Product delete झाला' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/products/farmer/my-products - Farmer चे स्वतःचे products
router.get('/farmer/my-products', protect, authorize('farmer'), async (req, res) => {
  try {
    const products = await Product.find({ farmer: req.user._id }).sort({ createdAt: -1 });
    res.json({ success: true, products });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
