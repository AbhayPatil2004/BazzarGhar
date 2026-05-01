# Product Page Debugging Guide

## Product Page Components & Required Endpoints

### 1. **Similar Products**
- **Endpoint**: `GET /product/similar/:productId`
- **Query**: `?limit=6`
- **Expected Response**: 
```json
{
  "statusCode": 200,
  "data": {
    "similarProducts": [...]
  }
}
```
- **What it shows**: Products with same category and ±30% price range
- **Status**: ✅ Controller exists

### 2. **More From Store**
- **Endpoint**: `GET /store/:storeId/products`
- **Query**: `?limit=8`
- **Expected Response**: 
```json
{
  "statusCode": 200,
  "data": [...]  // Array of products
}
```
- **What it shows**: All products from the same store
- **Status**: ✅ Controller exists

### 3. **Category Products**
- **Endpoint**: `GET /product/products`
- **Query**: `?category=:category&limit=8`
- **Expected Response**: 
```json
{
  "data": {
    "products": [...]
  }
}
```
- **What it shows**: All products in the same category
- **Status**: ✅ Controller exists

### 4. **Similar By Name**
- **Endpoint**: `GET /product/search`
- **Query**: `?q=:keyword&limit=8`
- **Expected Response**: 
```json
{
  "data": {
    "products": [...]
  }
}
```
- **What it shows**: Products with similar names/keywords
- **Status**: ✅ Controller exists

---

## How to Test

### Option 1: Using Browser DevTools
1. Open product page in browser
2. Press `F12` to open DevTools
3. Go to **Network** tab
4. Refresh the page
5. Look for failed requests (red text)
6. Click on each failed request to see error details

### Option 2: Using cURL
```bash
# Test Similar Products
curl http://localhost:5000/product/similar/6985eea2afa7df528835a3b7?limit=6

# Test Store Products
curl http://localhost:5000/store/[STORE_ID]/products?limit=8

# Test Category Products
curl http://localhost:5000/product/products?category=Electronics&limit=8

# Test Search/Similar By Name
curl http://localhost:5000/product/search?q=laptop&limit=8
```

---

## Troubleshooting

### Issue: Nothing shows on product page
**Solution**: 
- Check browser console for JavaScript errors
- Open DevTools Network tab and look for 404/500 errors
- Verify product ID exists: `6985eea2afa7df528835a3b7`
- Check backend is running on port 5000

### Issue: One section shows empty
**Solution**:
- That's OK! The component will hide itself if no data is available
- Check the specific endpoint for that section in Network tab
- Verify the backend query parameters are correct

### Issue: "Failed to fetch" error
**Solution**:
- Ensure CORS is enabled in backend
- Check `NEXT_PUBLIC_API_URL` env var is set correctly
- Verify backend server is running

---

## How Sections Hide Automatically

Each component checks for data and hides itself if:
- Loading fails
- No products returned
- All products are filtered out

So you'll only see sections with actual content!

---

## What Product Data Should Look Like

```json
{
  "_id": "6985eea2afa7df528835a3b7",
  "title": "Product Name",
  "description": "Product description",
  "price": 1000,
  "finalPrice": 800,
  "discountPercentage": 20,
  "images": ["url1", "url2"],
  "category": "Electronics",
  "rating": 4.5,
  "reviewCount": 45,
  "stock": 10,
  "store": {
    "_id": "store-id",
    "storeName": "Store Name"
  }
}
```

All components expect this structure and gracefully handle missing fields.
