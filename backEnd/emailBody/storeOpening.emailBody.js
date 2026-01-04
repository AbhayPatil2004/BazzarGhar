function storeOpeningBody(
  adminName,
  owner,
  storeName,
  description,
  storeProducts,
  address
) {
  return `
<!DOCTYPE html>
<html>
<body style="margin:0;padding:0;background-color:#f4f6f8;">
  <table width="100%" cellpadding="0" cellspacing="0">
    <tr>
      <td align="center" style="padding:20px;">
        <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:8px;padding:30px;font-family:Arial,sans-serif;color:#333;">
          
          <!-- Header -->
          <tr>
            <td align="center" style="padding-bottom:20px;">
              <h2 style="margin:0;color:#111827;">AuraWear</h2>
              <p style="margin:5px 0 0;color:#555;">New Store Opening Request</p>
            </td>
          </tr>

          <!-- Greeting -->
          <tr>
            <td style="padding-bottom:15px;">
              <p>Hello <b>${adminName}</b>,</p>
              <p>
                A new store opening request has been submitted by 
                <b>${owner}</b>. Below are the details:
              </p>
            </td>
          </tr>

          <!-- Store Details -->
          <tr>
            <td style="background:#f9fafb;padding:15px;border-radius:6px;">
              <p><b>Store Name:</b> ${storeName}</p>
              <p><b>Description:</b> ${description}</p>
              <p><b>Products:</b> ${storeProducts}</p>
              <p><b>Address:</b> ${address}</p>
            </td>
          </tr>

          <!-- Action -->
          <tr>
            <td style="padding-top:20px;">
              <p>
                Please review this request and take the necessary action 
                from the admin dashboard.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td align="center" style="padding-top:30px;font-size:12px;color:#777;">
              © ${new Date().getFullYear()} AuraWear. All rights reserved.
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;
}

export default storeOpeningBody;
