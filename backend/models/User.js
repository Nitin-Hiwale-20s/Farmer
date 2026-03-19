const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
  phone: { type: String, required: true },
  role: {
    type: String,
    enum: ['farmer', 'buyer', 'delivery', 'admin'],
    required: true
  },

  // Farmer specific
  farmName: { type: String },
  farmLocation: {
    village: String,
    taluka: String,
    district: String,
    state: String,
    pincode: String
  },
  farmerId: { type: String, unique: true, sparse: true }, // Unique Farmer ID like FC-2024-001

  // Buyer specific
  deliveryAddress: [{
    label: String,
    street: String,
    city: String,
    district: String,
    pincode: String,
    isDefault: { type: Boolean, default: false }
  }],

  // Delivery Boy specific
  vehicleNumber: { type: String },
  assignedArea: { type: String },
  isAvailable: { type: Boolean, default: true },

  // Common
  profileImage: { type: String, default: '' },
  isActive: { type: Boolean, default: true },
  isVerified: { type: Boolean, default: false },
  rating: { type: Number, default: 0 },
  totalRatings: { type: Number, default: 0 }
}, { timestamps: true });

// Hash password before save
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Generate Farmer ID
userSchema.pre('save', async function(next) {
  if (this.role === 'farmer' && !this.farmerId) {
    const count = await mongoose.model('User').countDocuments({ role: 'farmer' });
    this.farmerId = `FC-${new Date().getFullYear()}-${String(count + 1).padStart(4, '0')}`;
  }
  next();
});

userSchema.methods.comparePassword = async function(password) {
  return bcrypt.compare(password, this.password);
};

module.exports = mongoose.model('User', userSchema);
