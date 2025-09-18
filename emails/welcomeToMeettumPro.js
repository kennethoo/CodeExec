import sgMail from "@sendgrid/mail";
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

function welcomeToMeettumPro({ email, username }) {
  const msg = {
    to: email,
    from: "noreply@meettum.com",
    subject: "Welcome to Meettum Pro",
    text: "Welcome to Meettum Pro",
    html: `<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
            background-color: #f4f4f4;
        }
        .container {
            max-width: 600px;
            margin: auto;
            background: #ffffff;
            padding: 20px;
        }
        .header {
            background-color: #6f56e5;
            color: #ffffff;
            padding: 10px;
            text-align: center;
            border-radius:10px
        }
        .content {
            padding: 20px;
            text-align: left;
            line-height: 1.6;
        }
        .footer {
            background-color: #333333;
            color: #ffffff;
            text-align: center;
            padding: 10px;
            font-size: 12px;
            border-radius:10px
        }
        @media (max-width: 600px) {
            .container {
                width: 100%;
                padding: 0;
            }
            .content, .footer, .header {
                padding: 20px;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Welcome to MeetTum Pro!</h1>
        </div>
        <div class="content">
            <p>Dear ${username},</p>
            <p>We're thrilled to have you as a MeetTum Pro user. Your decision to upgrade is a step towards unlocking more powerful features and capabilities designed to enhance your meeting experiences. Here’s what you can look forward to:</p>
            <ul>
                <li>Advanced scheduling options</li>
                <li>Enhanced meeting analytics</li>
                <li>Priority customer support</li>
            </ul>
            <p>If you have any questions or need assistance, our dedicated support team is here for you. Contact us anytime at noreply@meettum.com.</p>
            <p>Thank you for choosing Meettum. We're excited to support you in making your online expexperince  more productive and engaging.</p>
            <p>Best regards,</p>
            <p>The MeetTum Pro Team</p>
        </div>
        <div class="footer">
           
            <p>&copy; 2024  Meettum. All rights reserved.</p>
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
module.exports = welcomeToMeettumPro;
