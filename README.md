# 🛍️ BazzarGhar - Multi-Vendor E-Commerce Platform

A modern, full-stack e-commerce platform built with **Next.js 13+**, **Node.js**, **Express**, and **MongoDB**. AuraShop enables sellers to create their stores, list products, and manage orders while providing buyers with a seamless shopping experience.

## 📋 Table of Contents
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Environment Setup](#environment-setup)
- [Running the Application](#running-the-application)
- [API Documentation](#api-documentation)
- [Frontend Components](#frontend-components)
- [Database Models](#database-models)
- [Key Features Details](#key-features-details)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)

---

## ✨ Features

### 👥 User Management
- ✅ User authentication (signup, login, logout)
- ✅ Role-based access control (Buyer, Seller, Admin)
- ✅ OTP verification
- ✅ User profile management
- ✅ Password reset functionality

### 🛒 Shopping Features
- ✅ Product catalog with advanced filtering
- ✅ Product search with keywords
- ✅ Shopping cart management
- ✅ Wishlist functionality
- ✅ Product reviews and ratings
- ✅ Similar product recommendations
- ✅ Category-based product discovery
- ✅ Seller store browsing

### 💳 Order Management
- ✅ Checkout with multiple payment options
- ✅ Razorpay payment integration
- ✅ Order tracking and history
- ✅ Delivery OTP verification
- ✅ Invoice generation (HTML)
- ✅ Order returns and refunds
- ✅ Order status management

### 🏪 Seller Features
- ✅ Store creation and management
- ✅ Product listing with dynamic fields
- ✅ Category-specific size options (kg, L, ml, XS-3XL, shoe sizes)
- ✅ Delivery time selection
- ✅ Color and size variants
- ✅ Image and video uploads
- ✅ Store analytics dashboard
- ✅ Order management
- ✅ Store reviews and ratings

### 👨‍💼 Admin Features
- ✅ User and seller management
- ✅ Store approval/rejection
- ✅ Product moderation
- ✅ Order oversight
- ✅ Analytics and reporting
- ✅ Sponsorship management

### 🎨 Additional Features
- ✅ Modern, responsive UI with Tailwind CSS
- ✅ Toast notifications for user feedback
- ✅ Image optimization with Cloudinary
- ✅ Redis caching for performance
- ✅ Email notifications
- ✅ Real-time product recommendations
- ✅ Store follow/unfollow functionality

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 13+ (App Router)
- **Language**: React with JavaScript/TypeScript
- **Styling**: Tailwind CSS
- **HTTP Client**: Axios, Fetch API
- **State Management**: React Context API + Hooks
- **UI Components**: Lucide React (Icons)
- **Notifications**: React Hot Toast
- **Form Handling**: Custom hooks

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT + Cookies
- **Image Upload**: Cloudinary
- **Payment Gateway**: Razorpay
- **Email Service**: Nodemailer
- **Caching**: Redis
- **File Upload**: Multer

### Database
- **Primary**: MongoDB
- **Caching**: Redis
- **Collections**: Users, Products, Orders, Stores, Reviews, Wishlists, Carts

---

## 📁 Project Structure

```
AuraShop/
├── frontend/                          # Next.js Frontend Application
│   ├── app/
│   │   ├── layout.tsx                # Root layout
│   │   ├── page.tsx                  # Home page
│   │   ├── api/                      # API routes
│   │   ├── auth/                     # Authentication pages
│   │   ├── admin/                    # Admin dashboard
│   │   ├── seller/                   # Seller pages
│   │   │   ├── store/
│   │   │   │   └── [storeId]/
│   │   │   │       └── add-product/  # Product creation form
│   │   │   └── dashboard/
│   │   ├── product/                  # Product pages
│   │   │   ├── [id]/                 # Product detail page
│   │   │   └── components/           # Product discovery components
│   │   ├── cart/                     # Shopping cart
│   │   ├── checkout/                 # Checkout page
│   │   ├── profile/                  # User profile
│   │   │   └── wishlist/             # Wishlist page
│   │   ├── dashboard/                # User dashboard
│   │   ├── store/                    # Store pages
│   │   ├── home/                     # Home sections
│   │   └── components/               # Shared components
│   ├── context/                      # React Context (Auth, etc.)
│   ├── lib/                          # Utilities
│   ├── public/                       # Static assets
│   ├── package.json
│   ├── tsconfig.json
│   └── next.config.ts
│
├── backEnd/                          # Express.js Backend Application
│   ├── index.js                      # Server entry point
│   ├── package.json
│   ├── config/
│   │   └── cloudinary.config.js      # Cloudinary configuration
│   ├── controllers/                  # Route handlers
│   │   ├── user.controller.js
│   │   ├── product.controller.js
│   │   ├── order.controller.js
│   │   ├── seller.controller.js
│   │   ├── admin.controller.js
│   │   ├── cart.controller.js
│   │   ├── wishlist.controller.js
│   │   ├── review.controller.js
│   │   ├── store.controller.js
│   │   └── orderManagement.controller.js
│   ├── models/                       # Database schemas
│   │   ├── user.model.js
│   │   ├── product.model.js
│   │   ├── order.model.js
│   │   ├── store.model.js
│   │   ├── cart.model.js
│   │   ├── wishlist.model.js
│   │   ├── review.model.js
│   │   ├── brand.model.js
│   │   └── ...
│   ├── routes/                       # Express routes
│   │   ├── user.route.js
│   │   ├── product.route.js
│   │   ├── order.route.js
│   │   ├── seller.route.js
│   │   ├── admin.route.js
│   │   └── ...
│   ├── middleware/                   # Custom middleware
│   │   ├── authenticate.middleware.js
│   │   ├── admin.authorized.middleware.js
│   │   ├── seller.authorized.middleware.js
│   │   └── multer.middleware.js
│   ├── utils/                        # Helper functions
│   │   ├── ApiResponse.js
│   │   ├── sendMail.js
│   │   ├── cloudinaryUpload.js
│   │   ├── razorpay.js
│   │   ├── invoiceGenerator.js
│   │   └── ...
│   ├── emailBody/                    # Email templates
│   ├── dbConnect/                    # Database connection
│   ├── redisConnect/                 # Redis connection
│   └── public/                       # Generated files (invoices, etc.)
│
├── deploy.sh                         # Deployment script
├── SETUP_GUIDE.md                    # Setup instructions
├── IMPLEMENTATION_COMPLETE.md        # Implementation status
└── README.md                         # This file
```

---

## 📋 Prerequisites

Before you begin, ensure you have installed:
- **Node.js** (v16 or higher)
- **npm** or **yarn**
- **MongoDB** (local or Atlas)
- **Redis** (local or cloud)
- **Git**

### Required API Keys & Credentials:
- **Cloudinary**: Image hosting and management
- **Razorpay**: Payment processing
- **MongoDB Atlas**: Database (or local MongoDB)
- **Redis**: Caching service
- **Email Service**: SMTP credentials (Gmail, SendGrid, etc.)

---

## 🚀 Installation

### 1. Clone the Repository
```bash
git clone https://github.com/AbhayPatil2004/BazzarGhar.git
cd AuraShop
```

### 2. Install Backend Dependencies
```bash
cd backEnd
npm install
```

### 3. Install Frontend Dependencies
```bash
cd ../frontend
npm install
```

---

## 🔧 Environment Setup

### Backend Environment Variables (.env)
Create a `.env` file in the `backEnd` directory:

```env
# Server
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/aurashop

# Redis
REDIS_URL=redis://localhost:6379
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=

# JWT
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRE=7d

# Cloudinary
CLOUDINARY_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Razorpay
RAZORPAY_KEY_ID=your_razorpay_key
RAZORPAY_KEY_SECRET=your_razorpay_secret

# Email (Gmail/SendGrid)
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_password
EMAIL_SERVICE=gmail
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587

# Frontend URL (for email links, etc.)
FRONTEND_URL=http://localhost:3000
```

### Frontend Environment Variables (.env.local)
Create a `.env.local` file in the `frontend` directory:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloudinary_name
```

---

## ▶️ Running the Application

### Option 1: Run Separately

**Start Backend:**
```bash
cd backEnd
npm start
# Server runs at http://localhost:5000
```

**Start Frontend (in a new terminal):**
```bash
cd frontend
npm run dev
# App runs at http://localhost:3000
```

### Option 2: Run with Script
```bash
./deploy.sh
# This script sets up and starts both backend and frontend
```

### Option 3: Using Docker (if configured)
```bash
docker-compose up
```

---

## 📚 API Documentation

### Authentication Endpoints
```
POST   /api/user/register          # Register new user
POST   /api/user/login             # Login user
POST   /api/user/logout            # Logout user
POST   /api/user/verify-otp        # Verify OTP
GET    /api/user/profile           # Get user profile
PUT    /api/user/profile           # Update user profile
```

### Product Endpoints
```
GET    /api/product                # Get all products
GET    /api/product/:id            # Get product details
POST   /api/product/search         # Search products
GET    /api/product/category/:name # Get by category
GET    /api/product/similar/:id    # Get similar products
POST   /api/product                # Create product (admin)
PUT    /api/product/:id            # Update product
DELETE /api/product/:id            # Delete product
```

### Seller Endpoints
```
POST   /api/seller/store           # Create store
GET    /api/seller/store/:id       # Get store details
PUT    /api/seller/store/:id       # Update store
POST   /api/seller/store/addproduct/:storeId  # Add product
GET    /api/seller/orders          # Get seller orders
PUT    /api/seller/orders/:id      # Update order status
```

### Order Endpoints
```
POST   /api/order                  # Create order
GET    /api/order                  # Get user orders
GET    /api/order/:id              # Get order details
PUT    /api/order/:id              # Update order
POST   /api/order/payment          # Process payment
GET    /api/order/invoice/:id      # Download invoice
```

### Cart Endpoints
```
GET    /api/cart                   # Get cart items
POST   /api/cart                   # Add to cart
PUT    /api/cart/:id               # Update cart item
DELETE /api/cart/:id               # Remove from cart
```

### Wishlist Endpoints
```
GET    /api/wishlist               # Get wishlist
POST   /api/wishlist/toggle/:id    # Add/remove from wishlist
```

### Admin Endpoints
```
GET    /api/admin/users            # Get all users
GET    /api/admin/sellers          # Get all sellers
PUT    /api/admin/sellers/:id      # Approve/reject seller
GET    /api/admin/orders           # Get all orders
```

---

## 🎨 Frontend Components

### Key Components
- **Header**: Navigation, search, cart, profile menu
- **ProductCard**: Reusable product display
- **CategorySelector**: Dynamic category selection with icons (25 categories)
- **SizeSelector**: Category-specific size options
- **ColorPicker**: 16 color selection checkboxes
- **Cart**: Shopping cart management
- **Checkout**: Multi-step checkout process
- **ProfileIcon**: User profile dropdown menu
- **StoreCard**: Store information display
- **ReviewCard**: Product/store reviews
- **OrderCard**: Order summary display
- **AddProduct**: Seller product creation form

### Product Discovery Components
- **SimilarProducts**: Products by category and price (±30%)
- **CategoryProducts**: All products in same category
- **MoreFromStore**: Products from same seller
- **SimilarByName**: Products with matching keywords

### Dynamic Features
- **Category-Based Sizes**:
  - Fashion: XS, S, M, L, XL, 2XL, 3XL
  - Footwear: 6-13
  - Grocery: 100g, 250g, 500g, 1kg, 2kg, 5kg, 10kg
  - Beauty: 30ml, 50ml, 100ml, 200ml, 500ml
  - Bakery: 250g, 500g, 1kg, 2kg
  - Dairy: 250ml, 500ml, 1L, 2L
  - Default: S, M, L, XL

---

## 🗄️ Database Models

### User Model
```javascript
{
  name: String,
  email: String (unique),
  password: String,
  phone: String,
  role: String (enum: ['user', 'seller', 'admin']),
  address: String,
  city: String,
  state: String,
  zipCode: String,
  profileImage: String,
  isVerified: Boolean,
  createdAt: Date
}
```

### Product Model
```javascript
{
  title: String,
  description: String,
  category: String,
  price: Number,
  discountPercentage: Number,
  finalPrice: Number,
  gender: String,
  sizes: [String],
  colors: [String],
  images: [String],
  video: [String],
  stock: Number,
  deliveryTime: String,
  isReturnable: Boolean,
  tags: [String],
  searchKeyword: [String],
  store: ObjectId,
  seller: ObjectId,
  rating: Number,
  totalReviews: Number,
  isActive: Boolean,
  isDeleted: Boolean,
  createdAt: Date
}
```

### Order Model
```javascript
{
  user: ObjectId,
  items: [
    {
      product: ObjectId,
      quantity: Number,
      price: Number
    }
  ],
  totalAmount: Number,
  discount: Number,
  deliveryCharge: Number,
  status: String,
  paymentStatus: String,
  paymentMethod: String,
  deliveryAddress: String,
  deliveryOtp: String,
  estimatedDelivery: Date,
  createdAt: Date
}
```

### Store Model
```javascript
{
  name: String,
  seller: ObjectId,
  description: String,
  logo: String,
  banner: String,
  address: String,
  city: String,
  state: String,
  zipCode: String,
  rating: Number,
  isApproved: Boolean,
  storeProducts: [ObjectId],
  followers: [ObjectId],
  createdAt: Date
}
```

---

## 🎯 Key Features Details

### 1. **Role-Based Access Control**
- **Buyer**: Can browse, search, add to cart, checkout, review products
- **Seller**: Can manage store, add products, track orders, view analytics
- **Admin**: Can manage users, approve sellers, moderate content, view analytics

### 2. **Product Management**
- Dynamic form with category-specific options
- Image and video uploads (Cloudinary)
- Size variants based on category
- Color options (16 colors)
- Delivery time selection (9 options)
- Stock management

### 3. **Payment Processing**
- Razorpay integration
- Multiple payment methods
- Order confirmation emails
- Invoice generation

### 4. **Search & Discovery**
- Full-text search with keywords
- Category filtering
- Price range filtering
- Similar product recommendations
- Products by same seller
- Products by same category

### 5. **Order Management**
- Order tracking
- Delivery OTP verification
- Order returns
- Invoice download
- Order history

### 6. **Store Features**
- Store creation and customization
- Store reviews and ratings
- Store follow/unfollow
- Analytics dashboard
- Product management

---

## 🐛 Troubleshooting

### Common Issues

**1. MongoDB Connection Error**
```
Solution: Check MongoDB URI in .env
- Ensure MongoDB Atlas IP whitelist includes your IP
- Verify username and password are correct
- Check network connectivity
```

**2. Redis Connection Error**
```
Solution: Ensure Redis is running
- Local: redis-cli ping should return PONG
- Cloud: Verify Redis URL and credentials
```

**3. Cloudinary Upload Failed**
```
Solution: Verify Cloudinary credentials
- Check CLOUDINARY_NAME, API_KEY, API_SECRET in .env
- Ensure upload preset is configured
```

**4. JWT Token Expired**
```
Solution: Clear cookies and login again
- Browser DevTools → Application → Cookies → Clear
- Login again to get new token
```

**5. Port Already in Use**
```
Solution: Change port or kill process
- Backend: Modify PORT in .env
- Frontend: Next.js finds available port automatically
```

**6. CORS Errors**
```
Solution: Check CORS configuration
- Backend should allow frontend URL
- Ensure credentials: 'include' in fetch requests
```

---

## 📖 Additional Documentation

- [SETUP_GUIDE.md](./SETUP_GUIDE.md) - Detailed setup instructions
- [SELLER_SETUP_GUIDE.md](./SELLER_SETUP_GUIDE.md) - Seller onboarding guide
- [SELLER_ORDER_MANAGEMENT.md](./SELLER_ORDER_MANAGEMENT.md) - Order management docs
- [ORDER_MANAGEMENT_DOCUMENTATION.md](./ORDER_MANAGEMENT_DOCUMENTATION.md) - Order workflows
- [IMPLEMENTATION_COMPLETE.md](./IMPLEMENTATION_COMPLETE.md) - Implementation status

---

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## 👨‍💻 Author

**Abhay Patil**
- GitHub: [@AbhayPatil2004](https://github.com/AbhayPatil2004)
- Repository: [BazzarGhar](https://github.com/AbhayPatil2004/BazzarGhar)

---

## 📞 Support

For issues, questions, or suggestions:
1. Open an issue on GitHub
2. Check existing documentation
3. Review error logs and console messages

---

## 🚀 Roadmap

### Upcoming Features
- [ ] Real-time notifications (WebSocket)
- [ ] Advanced analytics dashboard
- [ ] Mobile app (React Native)
- [ ] Multi-language support
- [ ] Social features (follow sellers, share products)
- [ ] Subscription/recurring orders
- [ ] Marketplace analytics
- [ ] Seller performance metrics
- [ ] Advanced inventory management
- [ ] Integration with more payment gateways

---

**Last Updated**: May 1, 2026
**Version**: 1.0.0

---

## 🎉 Thank You!

Thank you for using AuraShop! We hope this e-commerce platform helps you build an amazing marketplace.

**Happy Selling! 🛍️**
