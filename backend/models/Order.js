const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  farmer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  productName: String,
  quantity: { type: Number, required: true },
  unit: String,
  pricePerUnit: { type: Number, required: true },
  totalPrice: { type: Number, required: true }
});

const orderSchema = new mongoose.Schema({
  orderId: { type: String, unique: true }, // FC-ORD-2024-0001
  buyer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },

  items: [orderItemSchema],

  totalAmount: { type: Number, required: true },
  deliveryCharge: { type: Number, default: 30 },
  grandTotal: { type: Number, required: true },

  deliveryAddress: {
    name: String,
    phone: String,
    street: String,
    city: String,
    district: String,
    pincode: String
  },

  status: {
    type: String,
    enum: [
      'pending',       // नुकताच order केला
      'confirmed',     // Farmer ने confirm केले
      'packed',        // Pack झाले
      'picked_up',     // Delivery boy ने घेतले
      'in_transit',    // वाटेत आहे
      'delivered',     // Delivered
      'cancelled'      // रद्द
    ],
    default: 'pending'
  },

  deliveryBoy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },

  statusHistory: [{
    status: String,
    timestamp: { type: Date, default: Date.now },
    note: String,
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
  }],

  paymentMethod: {
    type: String,
    enum: ['cod', 'online'],
    default: 'cod'
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'refunded'],
    default: 'pending'
  },

  expectedDelivery: { type: Date },
  deliveredAt: { type: Date },

  buyerReview: {
    rating: Number,
    comment: String,
    date: Date
  },

  cancelReason: { type: String }
}, { timestamps: true });

// Auto-generate orderId
orderSchema.pre('save', async function(next) {
  if (!this.orderId) {
    const count = await mongoose.model('Order').countDocuments();
    this.orderId = `FC-ORD-${new Date().getFullYear()}-${String(count + 1).padStart(5, '0')}`;
  }
  next();
});

module.exports = mongoose.model('Order', orderSchema);
