import sgMail from "@sendgrid/mail";
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

function inviteUserToMeeting({
  meetingSessionId,
  email,
  username,
  description,
  title,
}) {
  const msg = {
    to: email,
    from: "noreply@meettum.com",
    subject: `Meeting Invitation: ${title}`,
    text: `Meeting Invitation :${title}`,
    html: `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        body {
            font-family: 'Arial', sans-serif;
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
            background-color: rgb(111, 86, 229);
            color: #ffffff;
            padding: 1px;
            text-align: center;
      border-radius:10px
      
        }
        .content {
            padding: 20px;
            text-align: left;
            line-height: 1.6;
        }
        .button {
            display: block;
            width: 200px;
            margin: 20px auto;
            background-color: #6f56e5;

            padding: 10px;
            text-align: center;
            text-decoration: none;
            font-weight: bold;
            border-radius:10px
        }
      
        .footer {
            background-color: #333333;
            color: #ffffff;
            text-align: center;
            padding: 10px;
            font-size: 12px;
        }
        @media (max-width: 600px) {
            .container {
                width: 100%;
                padding: 0;
            }
            .content, .footer, .header {
                padding: 20px;
            }
            .button {
                width: auto;
                padding: 10px;
            }
        }
    </style>
</head>
<body>
    <div class="container">
     
        <div class="content">
            <p>Hey there</p>
            <p>How are you? this is just to let you known that you have been invited in a meetting by ${username} in Meettum </p>
            <p><strong>Meeting title:</strong> ${title}</p>
           
            <p><strong>Agenda:</strong> ${description}</p>
            <p>Please confirm your attendance by clicking the button below:

</p>
            <a 
               href="${process.env.CLIENT_URL}/meeting/status/${meetingSessionId}" class="button"  style="color:white">Confirm</a>
            <p>If you have any questions or need further assistance, please don't hesitate to reach out to us at support@meettum.com</p>
            <p>Looking forward to your participation.</p>
            <p>Best regards,</p>
            <p>Meettum</p>
        </div>
        <div class="footer">
            <p>&copy; 2024 meettum. All rights reserved.</p>
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
module.exports = inviteUserToMeeting;
