# Seller Order Management - Complete Implementation Guide

## Overview
This document describes the complete seller order management system including order acceptance/rejection, status updates, OTP generation, and invoice management.

## Features Implemented

### 1. **Seller Order Dashboard**
- Location: `/seller/orders`
- Displays all orders received by the seller
- Shows order statistics (total, pending, confirmed, delivered)
- Supports filtering by order status
- Pagination support (10 orders per page)

### 2. **Order Card Display**
- Shows order ID, date, and current status
- Customer information (name, phone, location)
- Products in the order with images, quantities, and prices
- Payment method and status
- Action buttons based on order status

### 3. **Order Actions Available**

#### A. View Details
- Opens a modal with complete order information
- Shows customer details, shipping address
- Lists all items with details (size, color, quantity)
- Displays order timeline with all status changes
- Shows seller request status for each item
- Displays delivery OTP verification status

#### B. Accept/Reject Order
**Available when status is:** pending or seller-requested

**Features:**
- Multi-select items to accept or reject
- Select all / Deselect all functionality
- Separate tabs for Accept and Reject actions
- Rejection requires reason (text area)
- Displays total amount of selected items
- Shows success confirmation

**API Endpoint:** `POST /order-management/seller/accept`
- Request body: `{ orderId, itemIndices }`
- Updates seller request status to "accepted"
- Sets decision date

**API Endpoint:** `POST /order-management/seller/reject`
- Request body: `{ orderId, itemIndices, reason }`
- Updates seller request status to "rejected"
- Stores rejection reason
- Restores product stock for rejected items

#### C. Update Status
**Available when status is:** confirmed, packed, shipped, out-for-delivery

**Features:**
- Radio button selection for next status
- Optional tracking number field (for shipped orders)
- Optional notes field
- Visual status flow diagram showing progression
- Special handling for shipped status (shows OTP info)

**Workflow:**
- pending → confirmed (seller confirms order)
- confirmed → packed (seller packs order)
- packed → shipped (seller ships order)
- shipped → out-for-delivery (logistics updates)

**API Endpoint:** `POST /order-management/seller/update-status`
- Request body: `{ orderId, status, trackingNumber?, notes? }`
- Updates order status
- Stores tracking number if provided
- Adds timeline entry

#### D. Send OTP
**Available when status is:** shipped

**Features:**
- Modal to send 6-digit OTP
- Choose delivery method: SMS (phone) or Email
- Pre-filled with customer's phone number
- OTP valid for 15 minutes
- One-time use only
- Success message confirmation

**API Endpoint:** `POST /order-management/seller/send-otp`
- Request body: `{ orderId, phoneNumber, email }`
- Generates 6-digit OTP
- Sends via SMS or Email
- Stores OTP in order with 15-minute expiry

### 4. **Order Status Flow**

```
Pending
   ↓
Seller Requested (awaiting seller decision)
   ↓
Confirmed (seller accepted)
   ↓
Packed (order packed)
   ↓
Shipped (order dispatched)
   ↓
Out for Delivery (in transit)
   ↓
Delivered (with OTP verification)
```

Alternative paths:
- Pending/Seller-requested → **Cancelled** (buyer cancels)
- Pending/Seller-requested → **Rejected-by-seller** (seller rejects)

### 5. **OTP Verification Process**

**From Seller Side:**
1. Order status: Shipped
2. Click "Send OTP" button
3. Choose delivery method (SMS/Email)
4. OTP sent to customer
5. Customer receives 6-digit code

**From Customer Side (in `/profile/myorder`):**
1. Order status: Out for Delivery
2. Click "Verify OTP" button
3. Enter 6-digit OTP
4. OTP verified → Order marked as Delivered

### 6. **Order Statistics**
Real-time statistics displayed at top:
- **Total Orders**: All orders for seller
- **Pending**: Orders awaiting seller action
- **Confirmed**: Orders accepted by seller
- **Delivered**: Orders successfully delivered

---

## API Endpoints

### Getting Seller Orders
```
GET /order-management/seller/orders?status=confirmed&page=1&limit=10
```

**Query Parameters:**
- `status` (optional): Filter by order status
- `page` (optional, default: 1): Page number
- `limit` (optional, default: 10): Items per page

**Response:**
```json
{
  "status": 200,
  "data": {
    "orders": [...],
    "pagination": {
      "total": 25,
      "pages": 3,
      "currentPage": 1
    }
  },
  "message": "Orders fetched successfully"
}
```

### Accept Order
```
POST /order-management/seller/accept
Content-Type: application/json

{
  "orderId": "507f1f77bcf86cd799439011",
  "itemIndices": [0, 1]
}
```

### Reject Order
```
POST /order-management/seller/reject
Content-Type: application/json

{
  "orderId": "507f1f77bcf86cd799439011",
  "itemIndices": [0],
  "reason": "Out of stock"
}
```

### Update Order Status
```
POST /order-management/seller/update-status
Content-Type: application/json

{
  "orderId": "507f1f77bcf86cd799439011",
  "status": "shipped",
  "trackingNumber": "TRK123456789",
  "notes": "Shipped via FedEx"
}
```

### Send OTP to Customer
```
POST /order-management/seller/send-otp
Content-Type: application/json

{
  "orderId": "507f1f77bcf86cd799439011",
  "phoneNumber": "9876543210",
  "email": null
}
```

---

## Frontend Routes

| Route | Component | Purpose |
|-------|-----------|---------|
| `/seller/orders` | `SellerOrdersPage` | Main seller orders dashboard |
| `/seller/orders` | `SellerOrderCard` | Individual order card |
| Modal | `SellerOrderDetailsModal` | Detailed order view |
| Modal | `AcceptRejectModal` | Accept/reject decision |
| Modal | `UpdateStatusModal` | Status update form |
| Modal | `SendOTPModal` | OTP sending form |

---

## File Structure

```
frontend/app/seller/
├── orders/
│   ├── page.jsx              # Main page
│   └── sellerOrders.css      # Page styling
├── components/
│   └── order/
│       ├── SellerOrderCard.jsx
│       ├── SellerOrderCard.css
│       ├── SellerOrderDetailsModal.jsx
│       ├── SellerOrderDetailsModal.css
│       ├── AcceptRejectModal.jsx
│       ├── AcceptRejectModal.css
│       ├── UpdateStatusModal.jsx
│       ├── UpdateStatusModal.css
│       ├── SendOTPModal.jsx
│       └── SendOTPModal.css
```

---

## Database Changes

No schema changes needed. Uses existing order model with:
- `items[].sellerRequestStatus` - Track seller's decision
- `items[].sellerDecisionDate` - When seller made decision
- `items[].rejectionReason` - Why seller rejected
- `deliveryOTP` - OTP for delivery verification
- `trackingNumber` - Courier tracking number
- `timeline` - Order status history

---

## Key Features

### ✅ Multi-item Orders
- Sellers can accept/reject individual items in an order
- Partial acceptance/rejection supported
- Stock restored for rejected items

### ✅ Real-time Updates
- Statistics update on modal close
- Pagination maintained
- Filters applied correctly

### ✅ OTP System
- 6-digit auto-generated OTP
- 15-minute validity
- SMS and Email delivery options
- One-time use verification

### ✅ Audit Trail
- Complete timeline of order status changes
- Shows who updated and when
- Notes stored for tracking

### ✅ Responsive Design
- Mobile-friendly layout
- Touch-optimized modals
- Adaptive grid layout

---

## How to Use

### For Sellers:

1. **Navigate to Orders**
   - Go to `/seller/orders`
   - View all orders received

2. **Accept/Reject Orders**
   - Click "Accept/Reject" on pending orders
   - Select items to accept/reject
   - Provide reason if rejecting
   - Confirm action

3. **Update Order Status**
   - Click "Update Status" on confirmed orders
   - Select next status
   - Add tracking number (for shipped)
   - Add notes if needed
   - Save changes

4. **Send OTP to Customer**
   - When order is shipped, click "Send OTP"
   - Choose delivery method
   - OTP sent to customer's phone/email
   - Customer verifies on delivery

5. **Track Orders**
   - Use status filter to view specific orders
   - Check pagination for multiple pages
   - View detailed timeline for any order

---

## Testing Checklist

- [ ] Can view all seller orders
- [ ] Statistics update correctly
- [ ] Status filter works
- [ ] Pagination works
- [ ] Can accept single/multiple items
- [ ] Can reject with reason
- [ ] Can update status progressively
- [ ] Tracking number saved correctly
- [ ] Can send OTP
- [ ] OTP appears in order timeline
- [ ] Modal closes and re-opens correctly
- [ ] Responsive on mobile devices

---

## Future Enhancements

1. **Bulk Actions**
   - Accept/reject multiple orders at once
   - Batch status updates

2. **Reports**
   - Order performance metrics
   - Rejection rate tracking
   - Delivery success rate

3. **Notifications**
   - Real-time order alerts
   - Delivery OTP reminders
   - Status update notifications

4. **Analytics**
   - Order trends
   - Customer satisfaction metrics
   - Seller performance dashboard

---

## Support

For issues or questions, contact the development team.

Last Updated: April 30, 2026
