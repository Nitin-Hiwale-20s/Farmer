# 🌾 FarmConnect - शेतकरी ते ग्राहक थेट

> **दलाल नाही, फसवणूक नाही — शेतकरी स्वतः किंमत ठरवतो**

FarmConnect एक MERN stack web application आहे जे शेतकरी आणि ग्राहक यांना थेट जोडते. दलाल (middleman) शिवाय शेतकरी आपला भाजीपाला/फळे विकू शकतो.

---

## 🏗️ Project Structure

```
farmconnect/
├── backend/                    # Node.js + Express + MongoDB
│   ├── models/
│   │   ├── User.js             # Farmer, Buyer, Delivery, Admin
│   │   ├── Product.js          # Vegetables/Fruits listing
│   │   └── Order.js            # Order lifecycle
│   ├── routes/
│   │   ├── auth.js             # Register, Login, JWT
│   │   ├── products.js         # CRUD for products
│   │   ├── orders.js           # Order management
│   │   ├── admin.js            # Admin controls
│   │   └── delivery.js         # Delivery operations
│   ├── middleware/
│   │   └── auth.js             # JWT protect + role authorize
│   ├── server.js               # Main server + Socket.io
│   ├── .env                    # Environment variables
│   └── package.json
│
└── frontend/                   # React.js
    └── src/
        ├── context/
        │   ├── AuthContext.js  # Global auth state
        │   └── CartContext.js  # Shopping cart state
        ├── pages/
        │   ├── LandingPage.js  # Home page
        │   ├── LoginPage.js    # Login
        │   ├── RegisterPage.js # Multi-step registration
        │   ├── ShopPage.js     # Browse vegetables
        │   ├── ProductDetail.js
        │   ├── CartPage.js     # Shopping cart
        │   ├── CheckoutPage.js # Place order
        │   ├── OrdersPage.js   # Buyer orders
        │   ├── OrderDetail.js  # Order tracking
        │   ├── Farmer/
        │   │   ├── FarmerDashboard.js
        │   │   ├── FarmerProducts.js
        │   │   ├── AddProduct.js
        │   │   └── FarmerOrders.js
        │   ├── Admin/
        │   │   ├── AdminDashboard.js
        │   │   ├── AdminUsers.js
        │   │   ├── AdminProducts.js
        │   │   └── AdminOrders.js
        │   └── Delivery/
        │       ├── DeliveryDashboard.js
        │       └── DeliveryOrders.js
        ├── App.js              # Routes
        └── index.js
```

---

## 👥 User Roles

| Role | काय करतो | Dashboard |
|------|-----------|-----------|
| 🌾 **Farmer** | भाजीपाला list करतो, orders confirm करतो | `/farmer` |
| 🏠 **Buyer** | भाजीपाला खरेदी करतो, order track करतो | `/shop` |
| 🚴 **Delivery Boy** | Orders pickup करतो, deliver करतो | `/delivery` |
| 👑 **Admin** | सर्व manage करतो, products approve करतो | `/admin` |

---

## 🔄 Order Lifecycle

```
Buyer Order करतो
      ↓
  [PENDING]
      ↓
Farmer Confirm करतो
   [CONFIRMED]
      ↓
Farmer Pack करतो
    [PACKED]
      ↓
Delivery Boy Pickup करतो
   [PICKED_UP]
      ↓
Transit मध्ये
  [IN_TRANSIT]
      ↓
घरापर्यंत पोहोचले
  [DELIVERED] ✅
```

---

## 🚀 Setup Instructions

### Prerequisites
- Node.js v18+
- MongoDB (local किंवा MongoDB Atlas)
- npm किंवा yarn

### Step 1: Clone / Download
```bash
# project folder मध्ये जा
cd farmconnect
```

### Step 2: Backend Setup
```bash
cd backend
npm install

# .env file edit करा
# MONGO_URI=mongodb://localhost:27017/farmconnect
# JWT_SECRET=your_secret_key_here
# PORT=5000

npm run dev
# Server: http://localhost:5000
```

### Step 3: Frontend Setup
```bash
cd ../frontend
npm install
npm start
# App: http://localhost:3000
```

### Step 4: Create Admin User
MongoDB मध्ये manually admin create करा:
```javascript
// MongoDB Compass किंवा mongosh वापरा
use farmconnect
db.users.insertOne({
  name: "Admin",
  email: "admin@farmconnect.com",
  password: "$2a$12$...", // bcrypt hash of "admin123"
  phone: "9999999999",
  role: "admin",
  isActive: true,
  isVerified: true,
  createdAt: new Date(),
  updatedAt: new Date()
})
```

किंवा register endpoint वापरा आणि नंतर role manually change करा.

---

## 🌐 API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | New user register |
| POST | `/api/auth/login` | Login & get token |
| GET | `/api/auth/me` | Current user info |

### Products
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/products` | सर्व available products |
| GET | `/api/products/:id` | Single product |
| POST | `/api/products` | नवीन product (Farmer only) |
| PUT | `/api/products/:id` | Update product (Farmer) |
| DELETE | `/api/products/:id` | Delete product |
| GET | `/api/products/farmer/my-products` | Farmer चे products |

### Orders
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/orders` | Order place करा (Buyer) |
| GET | `/api/orders/my-orders` | Buyer चे orders |
| GET | `/api/orders/farmer-orders` | Farmer चे orders |
| GET | `/api/orders/delivery-orders` | Delivery orders |
| PUT | `/api/orders/:id/status` | Status update |

### Admin
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/admin/dashboard` | Stats |
| GET | `/api/admin/users` | सर्व users |
| PUT | `/api/admin/users/:id/verify` | Farmer verify |
| PUT | `/api/admin/products/:id/approve` | Product approve |
| PUT | `/api/admin/orders/:id/assign-delivery` | Delivery assign |

---

## ✨ Features

### 🌾 Farmer Features
- ✅ Unique **Farmer ID** auto-generate (FC-2024-0001)
- ✅ Product add करा (photo, price, quantity, organic flag)
- ✅ Orders confirm आणि pack करा
- ✅ Earnings dashboard
- ✅ Real-time order notifications

### 🏠 Buyer Features
- ✅ Category/search/sort filter
- ✅ Shopping cart
- ✅ Checkout with address
- ✅ Cash on Delivery / Online payment
- ✅ Live order tracking with progress bar
- ✅ Free delivery above ₹500

### 🚴 Delivery Boy Features
- ✅ Available orders बघा
- ✅ Order accept करा
- ✅ Status update (pickup → transit → delivered)
- ✅ Availability toggle

### 👑 Admin Features
- ✅ Dashboard with all stats
- ✅ Product approval system
- ✅ Farmer verification
- ✅ User block/activate
- ✅ Delivery boy assignment to orders
- ✅ Revenue tracking

### 🔧 Technical Features
- ✅ JWT Authentication
- ✅ Role-based access control
- ✅ Socket.io real-time notifications
- ✅ Protected routes
- ✅ Responsive design

---

## 🔮 Future Enhancements

- [ ] Image upload (Cloudinary/AWS S3)
- [ ] Payment gateway (Razorpay)
- [ ] WhatsApp notifications
- [ ] Google Maps delivery tracking
- [ ] Mobile app (React Native)
- [ ] Bulk order / wholesale
- [ ] Weather-based crop suggestions
- [ ] Marathi language full support (i18n)

---

## 📞 Contact
Made with ❤️ for Maharashtra Farmers
**"शेतकरी समृद्ध तर देश समृद्ध"**
# Farmer
