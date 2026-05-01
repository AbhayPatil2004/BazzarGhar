# 🚀 Order Management System - Setup Guide

## ⚡ Quick Start

### Backend Setup

1. **Create public directory for invoices** (if not exists):
```bash
mkdir -p backEnd/public/invoices
```

2. **Update your `.env` file** (ensure these exist):
```
RAZORPAY_APIKEY=your_key
RAZORPAY_APIKEY_SECRET=your_secret
EMAIL_USER=your_email
EMAIL_APP_PASSWORD=your_password
MONGODB_URI=your_db_uri
```

3. **Install dependencies** (if needed):
```bash
cd backEnd
npm install

# If using PDF generation (optional future upgrade):
# npm install pdfkit
```

4. **Verify routes are integrated** in `index.js`:
```javascript
import orderManagementRouter from './routes/orderManagement.route.js';
app.use("/order-management", orderManagementRouter);
app.use(express.static('public'));
```

5. **Start backend server**:
```bash
npm run dev
```

### Frontend Setup

1. **Verify Next.js is configured** (`next.config.ts`):
```typescript
const nextConfig = {
  reactStrictMode: true,
  // Add other configs
};
```

2. **Check environment variables** (`.env.local`):
```
NEXT_PUBLIC_API_URL=http://localhost:5000
```

3. **Install axios** (if needed):
```bash
cd frontend
npm install axios
```

4. **Start frontend**:
```bash
npm run dev
```

5. **Access MyOrder page**:
```
http://localhost:3000/profile/myorder
```

---

## 🧪 Testing the System

### 1. **Create Test Order**

User creates an order:
```bash
curl -X POST http://localhost:5000/order/place-from-cart \
  -H "Content-Type: application/json" \
  -H "Cookie: jwt=your_token" \
  -d '{
    "paymentMethod": "COD"
  }'
```

### 2. **Check Order in MyOrder Page**

Navigate to: `http://localhost:3000/profile/myorder`
- Orders should appear in the grid
- Status should be "Pending"

### 3. **Seller Accepts Order**

```bash
curl -X POST http://localhost:5000/order-management/seller/accept \
  -H "Content-Type: application/json" \
  -H "Cookie: jwt=seller_token" \
  -d '{
    "orderId": "order_id",
    "itemIndex": 0
  }'
```

### 4. **Seller Updates Status**

```bash
curl -X POST http://localhost:5000/order-management/seller/update-status \
  -H "Content-Type: application/json" \
  -H "Cookie: jwt=seller_token" \
  -d '{
    "orderId": "order_id",
    "newStatus": "out-for-delivery",
    "note": "Order is on the way"
  }'
```

### 5. **Verify OTP**

- Check your email for OTP
- Go to order details and click "Verify OTP"
- Enter the 6-digit code
- Order should mark as delivered

### 6. **Download Invoice**

- Click "Invoice" button on order card
- Opens invoice in new tab

---

## 🎯 Feature Checklist

- ✅ Order Model Updated
- ✅ OTP Utility Created
- ✅ Invoice Generator Created
- ✅ Order Management Controller
- ✅ Order Management Routes
- ✅ MyOrder Page
- ✅ OrderCard Component
- ✅ Order Details Modal
- ✅ OTP Verification Modal
- ✅ Status Filtering
- ✅ Pagination
- ✅ Email Notifications
- ✅ Timeline Tracking
- ✅ Seller Request System
- ✅ Invoice Generation

---

## 🔍 Troubleshooting Checklist

### Backend Issues

- [ ] MongoDB connected?
  ```bash
  # Check in console for "MongoDB connected"
  ```

- [ ] Routes imported correctly?
  ```bash
  # Check index.js for orderManagementRouter
  ```

- [ ] Public directory exists?
  ```bash
  # ls -la backEnd/public/invoices
  ```

- [ ] Environment variables set?
  ```bash
  # Check .env file
  ```

### Frontend Issues

- [ ] API URL correct?
  ```bash
  # Check .env.local for NEXT_PUBLIC_API_URL
  ```

- [ ] Components imported correctly?
  ```bash
  # Check path: app/profile/components/order/
  ```

- [ ] Styles loading?
  ```bash
  # Check CSS imports in components
  ```

- [ ] Build successful?
  ```bash
  npm run build
  ```

### Data Issues

- [ ] User authenticated?
  ```bash
  # Check if JWT token in cookies
  ```

- [ ] Seller authorized?
  ```bash
  # Check if user has seller role
  ```

- [ ] Order exists?
  ```bash
  # Check MongoDB for order document
  ```

---

## 📝 Usage Examples

### Getting Orders
```javascript
// Frontend
const response = await axios.get(
  'http://localhost:5000/order-management/my-orders?page=1&limit=10',
  { withCredentials: true }
);
```

### Accepting Order (Seller)
```javascript
await axios.post(
  'http://localhost:5000/order-management/seller/accept',
  { orderId: 'xxx', itemIndex: 0 },
  { withCredentials: true }
);
```

### Verifying OTP
```javascript
await axios.post(
  'http://localhost:5000/order-management/verify-otp',
  { orderId: 'xxx', otp: '123456' },
  { withCredentials: true }
);
```

---

## 🎨 Customization

### Change Status Colors

Edit `OrderCard.css`:
```css
.status-pending {
  background: #fff3cd;  /* Change color */
  color: #856404;
}
```

### Change OTP Expiry

Edit `orderManagement.controller.js`:
```javascript
const otp = createOTP(30);  // 30 minutes instead of 15
```

### Change Pagination Limit

Edit `MyOrder` page:
```javascript
const queryParams = new URLSearchParams({
  page: currentPage,
  limit: 20,  // Changed from 10
});
```

---

## 🚨 Important Notes

1. **Make sure MongoDB is running** before starting backend
2. **CORS must be enabled** for frontend-backend communication
3. **Email credentials** must be correct for notifications to work
4. **Public directory** must be writable for invoice generation
5. **JWT tokens** must be properly set in cookies
6. **Seller authorization** depends on user role in database

---

## 📞 API Response Examples

### Successful Order Fetch
```json
{
  "status": 200,
  "message": "Orders fetched successfully",
  "data": {
    "orders": [
      {
        "_id": "xxx",
        "status": "confirmed",
        "totalAmount": 5000,
        "items": [...],
        "timeline": [...],
        "shippingAddress": {...}
      }
    ],
    "pagination": {
      "total": 15,
      "pages": 2,
      "currentPage": 1
    }
  }
}
```

### OTP Verification Success
```json
{
  "status": 200,
  "message": "Order delivered successfully",
  "data": {
    "_id": "xxx",
    "status": "delivered",
    "deliveryOTP": {
      "verified": true,
      "verifiedAt": "2024-01-15T10:30:00Z"
    }
  }
}
```

---

## 🎓 Learning Resources

- [Order Model Structure](../backEnd/models/order.model.js)
- [Controller Logic](../backEnd/controllers/orderManagement.controller.js)
- [Frontend Components](../frontend/app/profile/myorder/)
- [Full Documentation](./ORDER_MANAGEMENT_DOCUMENTATION.md)

---

**System Ready!** ✅ Your order management system is fully implemented and ready to use.

---
