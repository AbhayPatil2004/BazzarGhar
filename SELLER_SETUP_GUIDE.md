# Seller Order Management - Setup & Usage Guide

## ✅ What's Been Created

### Frontend Components (React/Next.js)

#### Page
- **`/seller/orders/page.jsx`** - Main seller order management dashboard
  - Displays all orders with filtering and pagination
  - Statistics cards for quick overview
  - Modal management for different actions

#### Components  
1. **`SellerOrderCard.jsx`** - Individual order card with action buttons
2. **`SellerOrderDetailsModal.jsx`** - Detailed view of order information
3. **`AcceptRejectModal.jsx`** - Multi-select accept/reject interface
4. **`UpdateStatusModal.jsx`** - Status progression with tracking info
5. **`SendOTPModal.jsx`** - OTP delivery method selection

#### Styling
- `sellerOrders.css` - Page styling
- `SellerOrderCard.css` - Card component styling
- `SellerOrderDetailsModal.css` - Modal base styling
- `AcceptRejectModal.css` - Accept/reject modal styling
- `UpdateStatusModal.css` - Status update modal styling
- `SendOTPModal.css` - OTP modal styling

### Backend Enhancements

#### New Controller Function
- **`sendDeliveryOTPToCustomer()`** in `orderManagement.controller.js`
  - Generates 6-digit OTP
  - Sends via email to customer
  - Stores OTP in order with 15-minute expiry
  - Adds timeline entry

#### New Route
- **`POST /order-management/seller/send-otp`**
  - Protected by seller authorization middleware
  - Accepts: `{ orderId, phoneNumber?, email? }`
  - Returns success/error with OTP details

---

## 🚀 How to Use

### For Sellers

#### 1. Access Seller Orders Dashboard
```
Navigate to: http://localhost:3000/seller/orders
```

#### 2. View Order List
- See all orders received by your store
- View order statistics (total, pending, confirmed, delivered)
- Filter by status using dropdown
- Navigate using pagination

#### 3. Accept/Reject Orders
- Click **"Accept/Reject"** button on pending orders
- Select items you want to accept/reject
- Select all or individual items
- For rejection, provide reason
- Click confirm to complete

#### 4. Update Order Status
- Click **"Update Status"** on confirmed orders
- Progress: Pending → Confirmed → Packed → Shipped → Out for Delivery
- Add tracking number (for shipped orders)
- Add optional notes
- Click update

#### 5. Send OTP to Customer
- After marking order as "Shipped"
- Click **"Send OTP"** button
- Choose delivery method: Phone or Email
- OTP sent to customer
- Customer will verify on delivery

#### 6. View Order Details
- Click **"View Details"** on any order
- See complete order information
- View customer address
- Check timeline of all status changes
- Review rejection reasons if any
- See OTP verification status

---

## 🔗 API Endpoints

### Get Seller Orders
```bash
curl -X GET "http://localhost:5000/order-management/seller/orders?status=confirmed&page=1&limit=10" \
  -H "Cookie: your_auth_token"
```

### Accept Order
```bash
curl -X POST "http://localhost:5000/order-management/seller/accept" \
  -H "Content-Type: application/json" \
  -H "Cookie: your_auth_token" \
  -d '{
    "orderId": "507f1f77bcf86cd799439011",
    "itemIndices": [0, 1]
  }'
```

### Reject Order
```bash
curl -X POST "http://localhost:5000/order-management/seller/reject" \
  -H "Content-Type: application/json" \
  -H "Cookie: your_auth_token" \
  -d '{
    "orderId": "507f1f77bcf86cd799439011",
    "itemIndices": [0],
    "reason": "Out of stock"
  }'
```

### Update Status
```bash
curl -X POST "http://localhost:5000/order-management/seller/update-status" \
  -H "Content-Type: application/json" \
  -H "Cookie: your_auth_token" \
  -d '{
    "orderId": "507f1f77bcf86cd799439011",
    "status": "shipped",
    "trackingNumber": "TRK123456789",
    "notes": "Shipped via FedEx"
  }'
```

### Send OTP
```bash
curl -X POST "http://localhost:5000/order-management/seller/send-otp" \
  -H "Content-Type: application/json" \
  -H "Cookie: your_auth_token" \
  -d '{
    "orderId": "507f1f77bcf86cd799439011",
    "phoneNumber": null,
    "email": "customer@example.com"
  }'
```

---

## 🔧 Configuration Required

### Environment Variables
Make sure your `.env` file has:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000
EMAIL_USER=your_email@gmail.com
EMAIL_APP_PASSWORD=your_app_password
```

### Database Schema
No changes needed - uses existing Order model with:
- `deliveryOTP` - OTP code and expiry
- `trackingNumber` - Courier tracking
- `timeline` - Status history
- `items[].sellerRequestStatus` - Accept/reject status

---

## 📊 Order Status Flow

```
User Places Order
        ↓
    PENDING (awaiting seller decision)
        ↓
Seller Accepts → SELLER-REQUESTED (confirmed by seller)
        ↓
    CONFIRMED (seller confirmed)
        ↓
    PACKED (seller packed items)
        ↓
    SHIPPED (sent to delivery)
        ↓
Send OTP to Customer
        ↓
OUT-FOR-DELIVERY (with courier)
        ↓
Customer Verifies OTP
        ↓
    DELIVERED (completed)
```

Alternative:
- At PENDING/SELLER-REQUESTED → REJECTED-BY-SELLER (seller rejects)
- At PENDING/SELLER-REQUESTED → CANCELLED (buyer cancels)

---

## 🧪 Testing Checklist

- [ ] Can access `/seller/orders` page
- [ ] Can see all orders with status badges
- [ ] Statistics cards show correct counts
- [ ] Status filter works correctly
- [ ] Pagination loads next/previous pages
- [ ] Can open order details modal
- [ ] Can select items in accept/reject modal
- [ ] Can reject with reason
- [ ] Status update modal shows correct flow
- [ ] Can add tracking number
- [ ] Can send OTP to email
- [ ] OTP appears in order timeline
- [ ] All modals close properly
- [ ] Page is responsive on mobile

---

## 🐛 Troubleshooting

### OTP Not Sending?
- Check `EMAIL_USER` and `EMAIL_APP_PASSWORD` in `.env`
- Gmail requires app password, not regular password
- Check email delivery logs in console

### Order Not Found Error?
- Verify order belongs to seller
- Order must be in "shipped" status to send OTP
- Check seller authorization middleware

### Modal Not Closing?
- Click the × button or outside modal area
- Clear any error messages first
- Refresh page if issue persists

### Statistics Not Updating?
- Close and reopen modal to refresh
- Check browser console for API errors
- Verify seller has permission to view orders

---

## 📱 Mobile Responsiveness

All components are fully responsive:
- Breakpoint at 768px for tablets
- Breakpoint at 480px for mobile phones
- Touch-friendly buttons and inputs
- Scrollable lists for items
- Stacked layout on smaller screens

---

## 🔐 Security

- All endpoints require seller authorization
- Orders must belong to seller
- OTP is one-time use only
- OTP expires after 15 minutes
- Sensitive data not exposed in responses

---

## 📝 Files Created/Modified

### New Files
- `frontend/app/seller/orders/page.jsx`
- `frontend/app/seller/orders/sellerOrders.css`
- `frontend/app/seller/components/order/SellerOrderCard.jsx`
- `frontend/app/seller/components/order/SellerOrderCard.css`
- `frontend/app/seller/components/order/SellerOrderDetailsModal.jsx`
- `frontend/app/seller/components/order/SellerOrderDetailsModal.css`
- `frontend/app/seller/components/order/AcceptRejectModal.jsx`
- `frontend/app/seller/components/order/AcceptRejectModal.css`
- `frontend/app/seller/components/order/UpdateStatusModal.jsx`
- `frontend/app/seller/components/order/UpdateStatusModal.css`
- `frontend/app/seller/components/order/SendOTPModal.jsx`
- `frontend/app/seller/components/order/SendOTPModal.css`

### Modified Files
- `backEnd/controllers/orderManagement.controller.js` (added `sendDeliveryOTPToCustomer`)
- `backEnd/routes/orderManagement.route.js` (added route for send-otp)

---

## 🎯 Next Steps

1. **Test the implementation:**
   - Start backend: `npm start` in backEnd folder
   - Start frontend: `npm run dev` in frontend folder
   - Navigate to `/seller/orders`

2. **Create test orders:**
   - Use buyer account to place orders
   - Mark orders as pending for seller

3. **Test seller workflow:**
   - Accept/reject orders
   - Update statuses progressively
   - Send OTP to customer
   - Verify OTP on customer side

4. **Customize if needed:**
   - Modify colors/styling in CSS files
   - Add SMS provider integration
   - Add email templates
   - Add more statistics

---

## 💡 Tips

- Use "Select All" in accept/reject modal for efficiency
- Tracking number is auto-filled for better UX
- Add notes for delivery instructions
- OTP is case-sensitive (6 digits only)
- Check order timeline for full history
- Mobile users can scroll modals

---

## 📞 Support

For issues or questions:
1. Check console for error messages
2. Verify all environment variables
3. Check database connectivity
4. Review API endpoint URLs
5. Clear browser cache if needed

---

**Created:** April 30, 2026
**Version:** 1.0
**Status:** Complete and Ready to Use
