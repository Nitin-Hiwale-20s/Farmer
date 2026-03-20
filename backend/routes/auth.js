const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { protect } = require('../middleware/auth');

const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET || 'farmconnect_secret_2024', { expiresIn: '30d' });

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    console.log('📝 Register request:', req.body.email, '| role:', req.body.role);
    const { name, email, password, phone, role, farmName, farmLocation, vehicleNumber, assignedArea } = req.body;

    if (!name || !email || !password || !phone || !role) {
      return res.status(400).json({ message: 'सर्व fields भरा' });
    }

    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: 'हा Email आधीच registered आहे' });

    const userData = { name, email, password, phone, role };
    if (role === 'farmer') { userData.farmName = farmName || ''; userData.farmLocation = farmLocation || {}; }
    if (role === 'delivery') { userData.vehicleNumber = vehicleNumber || ''; userData.assignedArea = assignedArea || ''; }

    const user = await User.create(userData);
    console.log('✅ User created:', user.email);

    res.status(201).json({
      success: true,
      message: 'Registration यशस्वी!',
      token: generateToken(user._id),
      user: { _id: user._id, name: user.name, email: user.email, role: user.role, farmerId: user.farmerId, isVerified: user.isVerified }
    });
  } catch (err) {
    console.error('❌ Register Error:', err.message);
    if (err.name === 'ValidationError') return res.status(400).json({ message: Object.values(err.errors).map(e => e.message).join(', ') });
    if (err.code === 11000) return res.status(400).json({ message: 'हा Email आधीच registered आहे' });
    res.status(500).json({ message: 'Server error: ' + err.message });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'Email आणि Password द्या' });

    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: 'Email किंवा Password चुकीचा आहे' });

    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(401).json({ message: 'Email किंवा Password चुकीचा आहे' });
    if (!user.isActive) return res.status(403).json({ message: 'Account block केला आहे' });

    console.log('✅ Login:', user.email, '| Role:', user.role);
    res.json({
      success: true,
      token: generateToken(user._id),
      user: { _id: user._id, name: user.name, email: user.email, role: user.role, farmerId: user.farmerId, farmName: user.farmName, isVerified: user.isVerified, profileImage: user.profileImage }
    });
  } catch (err) {
    console.error('❌ Login Error:', err.message);
    res.status(500).json({ message: 'Server error: ' + err.message });
  }
});

// GET /api/auth/me
router.get('/me', protect, async (req, res) => {
  res.json({ success: true, user: req.user });
});

// ✅ POST /api/auth/setup-admin — Admin account बनवा
router.post('/setup-admin', async (req, res) => {
  try {
    const { secretKey } = req.body;

    // Security check
    if (secretKey !== 'FARMCONNECT_SETUP_2024') {
      return res.status(403).json({ message: 'Invalid secret key' });
    }

    // Check if this specific admin already exists
    const exists = await User.findOne({ email: 'nitinhiwale009@gmail.com' });
    if (exists) {
      // Update role to admin if exists
      exists.role = 'admin';
      exists.isActive = true;
      exists.isVerified = true;
      await exists.save();
      return res.json({ success: true, message: '✅ Admin account updated!', email: exists.email });
    }

    // Create new admin
    const admin = await User.create({
      name: 'Nitin Hiwale',
      email: 'nitinhiwale009@gmail.com',
      password: 'Nitin@9588',
      phone: '9999999999',
      role: 'admin',
      isActive: true,
      isVerified: true
    });

    console.log('✅ Admin created:', admin.email);
    res.status(201).json({
      success: true,
      message: '✅ Admin account बनला!',
      email: admin.email,
      token: generateToken(admin._id)
    });
  } catch (err) {
    console.error('❌ Admin Setup Error:', err.message);
    res.status(500).json({ message: 'Error: ' + err.message });
  }
});

module.exports = router;
