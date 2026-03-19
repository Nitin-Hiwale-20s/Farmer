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
    const { name, email, password, phone, role, farmName, farmLocation, vehicleNumber, assignedArea } = req.body;

    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: 'Email already registered' });

    const userData = { name, email, password, phone, role };
    if (role === 'farmer') {
      userData.farmName = farmName;
      userData.farmLocation = farmLocation;
    }
    if (role === 'delivery') {
      userData.vehicleNumber = vehicleNumber;
      userData.assignedArea = assignedArea;
    }

    const user = await User.create(userData);

    res.status(201).json({
      success: true,
      message: 'Registration यशस्वी!',
      token: generateToken(user._id),
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        farmerId: user.farmerId,
        isVerified: user.isVerified
      }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: 'Email किंवा Password चुकीचा आहे' });
    }
    if (!user.isActive) return res.status(403).json({ message: 'Account block केला आहे. Admin ला संपर्क करा.' });

    res.json({
      success: true,
      token: generateToken(user._id),
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        farmerId: user.farmerId,
        farmName: user.farmName,
        isVerified: user.isVerified,
        profileImage: user.profileImage
      }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/auth/me
router.get('/me', protect, async (req, res) => {
  res.json({ success: true, user: req.user });
});

module.exports = router;
