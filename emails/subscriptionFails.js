import sgMail from "@sendgrid/mail";
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

function subscriptionFails({ email, username, publisherName }) {
  const msg = {
    to: email,
    from: "noreply@meettum.com",
    subject: "Subscription Payment Failed",
    text: "Myfitsta Subscription Payment Failed",
    html: `<!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Subscription Payment Failed</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              font-size: 16px;
              color: #333;
            }
            .email-container {
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
              border: 1px solid #ddd;
              background-color: #f9f9f9;
            }
            .email-title {
              font-size: 24px;
              font-weight: bold;
              margin-bottom: 20px;
            }
            .email-content {
              line-height: 1.5;
            }
            .email-footer {
              margin-top: 20px;
              font-size: 14px;
              color: #999;
            }
          </style>
        </head>
        <body>
          <div className="email-container">
            <div className="email-title">Subscription Payment Failed</div>
            <div className="email-content">
              <p>Dear ${username}</p>
              <p>We regret to inform you that your recent subscription payment attempt has failed. This could be due to insufficient funds, an expired credit card, or other issues with your payment method.</p>
              <p>We cuurently pause your subscription to ${publisherName} please update your payment information. You can do this by logging into your account and navigating to the "Payment Methode" section.</p>
              <p>If you have any questions or need assistance, please don't hesitate to contact our support team.</p>
              <p>Thank you for your prompt attention to this matter.</p>
              <p>Best regards,</p>
              <p>Myfitsta</p>
            </div>
            <div className="email-footer">
            Myfitsta Inc
            </div>
          </div>
        </body>
        </html>
        
                    `,
  };

  sgMail
    .send(msg)
    .then(() => {})
    .catch((error) => {
      console.error(error.response.body);
    });
}
module.exports = subscriptionFails;
