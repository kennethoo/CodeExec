import sgMail from "@sendgrid/mail";
sgMail.setApiKey(process.env.SENDGRID_API_KEY);
function remmideUserOfTaskEmail({ email, username, title }) {
  const msg = {
    to: email,
    from: "noreply@meettum.com",
    subject: "Task Reminder",
    text: "Task Reminder",
    html: `
    <!DOCTYPE html>
<html>
<head>
  <style>
    body {
      font-family: Arial, sans-serif;
      background-color: #f2f2f2;
    }
    
    .container {
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
      background-color: #ffffff;
      border-radius: 5px;
      box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    }
    
    h1 {
      color: #333333;
      font-size: 24px;
      margin: 0;
      text-align: center;
      padding-bottom: 10px;
      border-bottom: 1px solid #cccccc;
    }
    
    p {
      color: #666666;
      font-size: 16px;
      line-height: 1.5;
    }
    
    .button {
      display: inline-block;
      padding: 10px 20px;
      background-color: #0088cc;
      color: #ffffff;
      text-decoration: none;
      border-radius: 5px;
    }
    
    .button:hover {
      background-color: #006699;
    }
    
    .footer {
      margin-top: 20px;
      text-align: center;
    }
    
    .footer p {
      color: #999999;
      font-size: 12px;
    }
  </style>
</head>
<body>
<div className="logoBox">
        <img
            src="https://meettum.com/static/media/logo.152c221b7f080aea1d32.png"
            alt="MEETCODE Logo"
            width="150"
          />
        </div>
  <div className="container">
    <h1 Task Reminder</h1>
    <p><strong>Task:</strong>${title}</p>
    <div className="footer">
      <p>This reminder was sent to you by Meettum</p>
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
module.exports = remmideUserOfTaskEmail;
