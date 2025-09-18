import sgMail from "@sendgrid/mail";
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

function sorryEmail({ email }) {
  const msg = {
    to: email,
    from: "noreply@meettum.com",
    subject: "We're Back and Better Than Ever!",
    html: `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Service Interruption Apology</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            border: 1px solid #ddd;
            border-radius: 8px;
            background-color: #f9f9f9;
        }
        .header {
            background-color: #6f56e5;
            color: white;
            padding: 10px;
            border-radius: 8px 8px 0 0;
            text-align: center;
        }
        .content {
            padding: 20px;
        }
        .footer {
            text-align: center;
            padding: 10px;
            font-size: 0.9em;
            color: #777;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>We're Back and Better Than Ever!</h1>
        </div>
        <div class="content">
            <p>Dear meettum user,</p>
            <p>We hope this message finds you well. We are writing to sincerely apologize for the recent disruption to our service. As you may be aware, our system was down for the past two weeks, and we understand how much this affected your experience with us.</p>
            <p>We deeply regret any inconvenience this outage may have caused. Our team has been working around the clock to resolve the issues and ensure that our platform is now more reliable and robust than ever before. We have implemented significant improvements to prevent such disruptions in the future and to provide you with the seamless service you deserve.</p>
            <p>Your patience and understanding during this time have been greatly appreciated. We value your trust in us and are committed to making your experience with our service a positive one. If you have any questions or concerns, please do not hesitate to reach out to our support team at <a href="mailto:meettum_inc@outlook.com">meettum_inc@outlook.com</a>.</p>
            <p>Thank you for your continued support.</p>
            <p>Warm regards,</p>
          
               
               Meettum<br>
              </p>
        </div>
        <div class="footer">
            <p>&copy; 2024 Meettum. All rights reserved.</p>
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
module.exports = sorryEmail;
