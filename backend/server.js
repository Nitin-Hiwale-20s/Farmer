const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const http = require('http');
const { Server } = require('socket.io');

dotenv.config();

const app = express();
const server = http.createServer(app);

// ✅ CORS Fix — सर्व origins allow करा
const corsOptions = {
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: false
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions)); // Preflight requests handle करा

const io = new Server(server, {
  cors: { origin: '*', methods: ['GET', 'POST'] }
});

// Middleware
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/products', require('./routes/products'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/delivery', require('./routes/delivery'));

// Test route
app.get('/', (req, res) => {
  res.json({ message: '🌾 FarmConnect API Running!', status: 'ok' });
});

// Socket.io
io.on('connection', (socket) => {
  socket.on('join-room', (userId) => socket.join(userId));
  socket.on('order-status-update', (data) => {
    io.to(data.buyerId).emit('order-updated', data);
    io.to(data.farmerId).emit('order-updated', data);
  });
});

app.set('io', io);

// Global error handler
app.use((err, req, res, next) => {
  console.error('❌ Error:', err.message);
  res.status(500).json({ message: err.message || 'Server Error' });
});

// MongoDB
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/farmconnect')
  .then(() => console.log('✅ MongoDB Connected'))
  .catch(err => console.error('❌ MongoDB Error:', err.message));

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
