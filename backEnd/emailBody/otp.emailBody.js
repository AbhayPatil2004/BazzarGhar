function otpBody(username, otp) {
  return `
<!DOCTYPE html>
<html>
<head>
  <style>
    body {
      font-family: Arial, sans-serif;
      background-color: #f4f6f8;
      padding: 20px;
    }
    .container {
      max-width: 500px;
      margin: auto;
      background: #ffffff;
      padding: 30px;
      border-radius: 8px;
      text-align: center;
      box-shadow: 0 4px 10px rgba(0,0,0,0.1);
    }
    .logo {
      margin-bottom: 10px;
    }
    .logo img {
      max-width: 140px;
    }
    .brand {
      font-size: 24px;
      font-weight: bold;
      color: #111827;
      margin-bottom: 20px;
    }
    .otp {
      font-size: 28px;
      font-weight: bold;
      letter-spacing: 6px;
      color: #2c3e50;
      margin: 20px 0;
    }
    .footer {
      font-size: 12px;
      color: #777;
      margin-top: 30px;
    }
  </style>
</head>
<body>
  <div class="container">
    
    

    <!-- Heading -->
    <div class="brand">AuraWear</div>

    <h2>Email Verification</h2>
    <p>Hello <b>${username}</b>,</p>
    <p>Use the following OTP to verify your email address:</p>

    <div class="otp">${otp}</div>

    <p>This OTP is valid for <b>5 minutes</b>.</p>
    <p>If you did not request this, please ignore this email.</p>

    <div class="footer">
      <p>© ${new Date().getFullYear()} AuraWear. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
`;
}

export default otpBody;
