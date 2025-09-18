import sgMail from "@sendgrid/mail";
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

function sendMesageToMe(message) {
  const msg = {
    to: "kcgandonou19@gmail.com",
    from: "noreply@meettum.com",
    subject: message,
    text: message,
    html: `<html>
                <head>
                    <meta charset="UTF-8">
                    <title>MEETCODE Verification Code</title>
                </head>
                <body style="font-family: Arial, sans-serif;">
                
                    <table cellpadding="0" cellspacing="0" border="0" width="100%">
                        <tr>
                            <td align="center" style="background-color: #f5f5f5; padding: 20px;">
                                <table cellpadding="0" cellspacing="0" border="0" width="600" style="background-color: #ffffff; border-radius: 10px; overflow: hidden;">
                                    <tr>
                                        <td align="center" style="padding: 40px 0;">
                                            <img src="https://myfitsta.com/static/media/logo.84ddd6d7.png" alt="MEETCODE Logo" width="150">
                                        </td>
                                    </tr>
                              
                                
                                <p>${message}</p
                                </table>
                            </td>
                        </tr>
                    </table>
                
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
module.exports = sendMesageToMe;
