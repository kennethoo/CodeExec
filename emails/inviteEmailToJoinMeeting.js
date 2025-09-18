import sgMail from "@sendgrid/mail";
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

function inviteUserToJoinMeeting({ username, email, meetingSessionId }) {
  const msg = {
    to: email,
    from: "noreply@meettum.com",
    subject: `Meeting Invitation from ${username}`,
    text: `Hey, ${username} is Inviting you to a meeting`,
    html: `<html>
                <head>
                    <meta charset="UTF-8">
                    <title>Meeting Confirmation</title>
                       <style>

  
 
      .btn {
        display: inline-block;
        background-color: #6f56e5;
        color: #ffffff;
        padding: 10px;
        border-radius: 10px;
        font-size: 1.1rem;
        text-align: center;
        width: 100%;
        text-transform: uppercase;
        margin-bottom: 10px;
      }
    </style>
                </head>
                <body style="font-family: Arial, sans-serif;">
              
                    <table cellpadding="0" cellspacing="0" border="0" width="100%">
                      
                        <tr>
                            <td align="center" style="background-color: #f5f5f5; padding: 20px;">
                                <table cellpadding="0" cellspacing="0" border="0" width="600" style="background-color: #ffffff; border-radius: 10px; overflow: hidden;">
                                    <tr>
                                        <td align="center" style="padding: 40px 0;">
                                          
                                        </td>
                                    </tr>
                                    <tr>
                                        <td align="center" style="padding: 0 40px 20px 40px;">  <div className="logoBox">
        <img
            src="https://meettum.com/static/media/logo.152c221b7f080aea1d32.png"
            alt="MEETCODE Logo"
            width="150"
          />
        </div>
                                            <h1 style="color: #1a1a1a; font-size: 24px; margin-bottom: 10px;">Meeting Invitation!</h1>
                                            <p style="color: #666666; font-size: 16px; line-height: 1.5; margin: 0;">Hey How are you ? ${username} is inviting you to a current ongoing meeting. Click the Join button below to join the meeting</p>
                                                   <a style="color:#ffffff !important; text-decoration:none" href="${process.env.CLIENT_URL}/meeting/session/${meetingSessionId}" class="btn">JOIN Meetting</a>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td align="center" style="padding: 20px 40px 40px 40px;">
                                           
                                        </td>
                                    </tr>
                                    <tr>
                                        <td align="center" style="background-color: #1a1a1a; color: #ffffff; padding: 20px;">
                                            <p style="color: #ffffff; font-size: 16px; line-height: 1.5; margin: 0;">This email was sent by MEETCODE. &copy; 2023 MEETCODE Inc.</p>
                                        </td>
                                    </tr>
                                </table>
                            </td>
                        </tr>
                    </table>
                
                </body>
                </html>`,
  };
  sgMail
    .send(msg)
    .then(() => {})
    .catch((error) => {
      console.error(error.response.body);
    });
}
module.exports = inviteUserToJoinMeeting;
