const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

async function createAdmin() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB Connected!');

    // Delete if exists
    const deleted = await User.deleteOne({ email: 'nitinhiwale009@gmail.com' });
    if (deleted.deletedCount > 0) console.log('🗑️  Existing admin deleted');

    // Create admin — password will be auto-hashed by User model pre-save hook
    const admin = await User.create({
      name: 'Nitin Hiwale',
      email: 'nitinhiwale009@gmail.com',
      password: 'Nitin@9588',
      phone: '9999999999',
      role: 'admin',
      isActive: true,
      isVerified: true
    });

    console.log('');
    console.log('🎉 =============================');
    console.log('✅  Admin created successfully!');
    console.log('📧  Email   : nitinhiwale009@gmail.com');
    console.log('🔑  Password: Nitin@9588');
    console.log('👑  Role    : admin');
    console.log('🎉 =============================');
    process.exit(0);
  } catch (err) {
    console.error('❌ Error:', err.message);
    process.exit(1);
  }
}

createAdmin();
