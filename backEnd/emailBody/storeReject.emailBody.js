function storeRejectedEmailBody(ownerName, storeName) {
    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Store Application Rejected</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                background-color: #f4f6f8;
                margin: 0;
                padding: 0;
            }
            .container {
                max-width: 600px;
                margin: 40px auto;
                background-color: #ffffff;
                padding: 30px;
                border-radius: 8px;
                box-shadow: 0 4px 10px rgba(0, 0, 0, 0.08);
            }
            .header {
                text-align: center;
                margin-bottom: 20px;
            }
            .header h2 {
                color: #e74c3c;
                margin: 0;
            }
            .content p {
                color: #555;
                line-height: 1.6;
                font-size: 15px;
            }
            .store-name {
                font-weight: bold;
                color: #333;
            }
            .footer {
                margin-top: 30px;
                text-align: center;
                font-size: 13px;
                color: #999;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h2>Store Application Rejected</h2>
            </div>

            <div class="content">
                <p>Hello <strong>${ownerName}</strong>,</p>

                <p>
                    Thank you for your interest in opening your store
                    <span class="store-name">"${storeName}"</span> on our platform.
                </p>

                <p>
                    After carefully reviewing your application, we regret to inform you
                    that your store request has been <strong>rejected</strong> at this time.
                </p>

                <p>
                    This decision may be due to incomplete information or not meeting our
                    current requirements. You are welcome to review your details and
                    submit a new application in the future.
                </p>

                <p>
                    If you have any questions or need clarification, feel free to reach
                    out to our support team.
                </p>

                <p>Thank you for your understanding.</p>

                <p>
                    Regards,<br />
                    <strong>AuraWear Team</strong>
                </p>
            </div>

            <div class="footer">
                <p>&copy; ${new Date().getFullYear()} AuraWear. All rights reserved.</p>
            </div>
        </div>
    </body>
    </html>
    `;
}

export default storeRejectedEmailBody