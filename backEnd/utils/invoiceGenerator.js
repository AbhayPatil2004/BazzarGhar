import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Generate Invoice HTML (can be converted to PDF using a service)
 * @param {Object} order - Order object with all details
 * @param {Object} buyer - Buyer details
 * @returns {string} HTML content for invoice
 */
export const generateInvoiceHTML = (order, buyer) => {
  const orderDate = new Date(order.createdAt).toLocaleDateString();
  const invoiceNumber = `INV-${order._id.toString().slice(-8).toUpperCase()}`;

  let itemsHTML = order.items
    .map(
      (item, index) => `
    <tr>
      <td>${index + 1}</td>
      <td>${item.product?.title || 'Product'}</td>
      <td>${item.quantity}</td>
      <td>₹${item.price.toFixed(2)}</td>
      <td>₹${item.finalPrice.toFixed(2)}</td>
    </tr>
  `
    )
    .join('');

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Invoice - ${invoiceNumber}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color: #333; background: #f5f5f5; }
    .container { max-width: 900px; margin: 0 auto; background: white; padding: 40px; }
    .header { display: flex; justify-content: space-between; margin-bottom: 30px; border-bottom: 2px solid #007bff; padding-bottom: 20px; }
    .company-info h1 { color: #007bff; font-size: 28px; }
    .invoice-info { text-align: right; }
    .invoice-info p { margin: 5px 0; }
    .invoice-number { font-size: 16px; font-weight: bold; color: #007bff; }
    .invoice-date { color: #666; }
    
    .sections { display: grid; grid-template-columns: 1fr 1fr; gap: 40px; margin-bottom: 30px; }
    .section h3 { color: #007bff; font-size: 14px; font-weight: 600; text-transform: uppercase; margin-bottom: 10px; }
    .section p { margin: 5px 0; font-size: 14px; }
    
    .items-table { width: 100%; margin-bottom: 30px; }
    .items-table table { width: 100%; border-collapse: collapse; }
    .items-table th { background: #007bff; color: white; padding: 12px; text-align: left; font-size: 13px; }
    .items-table td { padding: 12px; border-bottom: 1px solid #ddd; font-size: 13px; }
    .items-table tr:hover { background: #f9f9f9; }
    
    .summary { margin-bottom: 30px; }
    .summary-row { display: flex; justify-content: flex-end; margin-bottom: 10px; }
    .summary-label { width: 200px; font-weight: 500; }
    .summary-value { width: 150px; text-align: right; padding-right: 20px; }
    .summary-row.total { border-top: 2px solid #007bff; padding-top: 10px; font-size: 18px; font-weight: bold; color: #007bff; }
    
    .footer { text-align: center; border-top: 1px solid #ddd; padding-top: 20px; color: #666; font-size: 12px; }
    .footer-note { font-style: italic; margin-top: 10px; }
  </style>
</head>
<body>
  <div class="container">
    <!-- Header -->
    <div class="header">
      <div class="company-info">
        <h1>AuraShop</h1>
        <p>Your Premium Shopping Destination</p>
      </div>
      <div class="invoice-info">
        <p class="invoice-number">${invoiceNumber}</p>
        <p class="invoice-date">${orderDate}</p>
        <p>Order Status: <strong>${order.status}</strong></p>
      </div>
    </div>

    <!-- Customer & Shipping Info -->
    <div class="sections">
      <div class="section">
        <h3>Bill To</h3>
        <p><strong>${buyer?.username || 'Customer'}</strong></p>
        <p>${buyer?.email || ''}</p>
        <p>${buyer?.phone || ''}</p>
      </div>
      <div class="section">
        <h3>Ship To</h3>
        <p><strong>${order.shippingAddress.fullName}</strong></p>
        <p>${order.shippingAddress.street}</p>
        <p>${order.shippingAddress.city}, ${order.shippingAddress.state} ${order.shippingAddress.postalCode}</p>
        <p>${order.shippingAddress.country}</p>
        <p><strong>Phone:</strong> ${order.shippingAddress.phone}</p>
      </div>
    </div>

    <!-- Items Table -->
    <div class="items-table">
      <table>
        <thead>
          <tr>
            <th style="width: 5%">S.No</th>
            <th style="width: 40%">Product</th>
            <th style="width: 15%">Qty</th>
            <th style="width: 20%">Unit Price</th>
            <th style="width: 20%">Total</th>
          </tr>
        </thead>
        <tbody>
          ${itemsHTML}
        </tbody>
      </table>
    </div>

    <!-- Summary -->
    <div class="summary">
      <div class="summary-row">
        <div class="summary-label">Subtotal:</div>
        <div class="summary-value">₹${order.totalAmount.toFixed(2)}</div>
      </div>
      <div class="summary-row">
        <div class="summary-label">Shipping:</div>
        <div class="summary-value">₹0.00</div>
      </div>
      <div class="summary-row">
        <div class="summary-label">Tax:</div>
        <div class="summary-value">₹0.00</div>
      </div>
      <div class="summary-row total">
        <div class="summary-label">Total:</div>
        <div class="summary-value">₹${order.totalAmount.toFixed(2)}</div>
      </div>
    </div>

    <!-- Payment Info -->
    <div class="sections">
      <div class="section">
        <h3>Payment Method</h3>
        <p>${order.paymentMethod}</p>
        <p>Status: <strong>${order.paymentStatus}</strong></p>
      </div>
    </div>

    <!-- Footer -->
    <div class="footer">
      <p>Thank you for shopping with AuraShop!</p>
      <p class="footer-note">This is an electronically generated invoice. No signature is required.</p>
      <p>For queries, contact: support@aurashop.com</p>
    </div>
  </div>
</body>
</html>
`;
};

/**
 * Save invoice HTML to file
 * @param {string} invoiceHTML - HTML content
 * @param {string} orderId - Order ID for filename
 * @returns {string} File path
 */
export const saveInvoiceHTML = (invoiceHTML, orderId) => {
  const invoicesDir = path.join(__dirname, '../public/invoices');
  
  // Create invoices directory if it doesn't exist
  if (!fs.existsSync(invoicesDir)) {
    fs.mkdirSync(invoicesDir, { recursive: true });
  }

  const fileName = `invoice-${orderId}.html`;
  const filePath = path.join(invoicesDir, fileName);

  fs.writeFileSync(filePath, invoiceHTML);

  return `/invoices/${fileName}`;
};

/**
 * Generate and save invoice for an order
 * @param {Object} order - Order object
 * @param {Object} buyer - Buyer object
 * @returns {string} Invoice file path
 */
export const generateInvoice = (order, buyer) => {
  const invoiceHTML = generateInvoiceHTML(order, buyer);
  const invoicePath = saveInvoiceHTML(invoiceHTML, order._id);
  return invoicePath;
};
