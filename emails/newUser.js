import sgMail from "@sendgrid/mail";
sgMail.setApiKey(process.env.SENDGRID_API_KEY);
function sendNewUserEmail({ email, username }) {
  const msg = {
    to: email,
    from: "noreply@meettum.com",
    subject: "Verification Code",
    text: "Verification Code",
    html: `
    <html lang="en">
    <head>
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css"
      />
      <link rel="preconnect" href="https://fonts.gstatic.com" />
      <link
        href="https://fonts.googleapis.com/css2?family=Hanalei+Fill&display=swap"
        rel="stylesheet"
      />
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.2/css/all.min.css"
        integrity="sha512-HK5fgLBL+xu6dm/Ii3z4xhlSUyZgTT9tuc/hSrtw6uzJOvgRr2a9jyxxT1ely+B+xFAmJKVSTbpM/CuL7qxO8w=="
        crossorigin="anonymous"
      />
      <link
        href="https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css"
        rel="stylesheet"
      />
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta charset="utf-8" />
      <link rel="icon" href="%PUBLIC_URL%/favicon.ico" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta name="theme-color" content="#000000" />
      <meta name="description" content="MEETCODE Create your fitness world." />
      <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
      <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
      <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
      <link rel="apple-touch-icon" href="%PUBLIC_URL%/logo.png" />
      <title>MEETCODE</title>
    </head>
  
    <style>
      @import url("https://fonts.googleapis.com/css2?family=Roboto:wght@300&display=swap");
      * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
  
        outline: none;
  
        -webkit-tap-highlight-color: transparent;
      }
  
      p {
        font-family: "Roboto", sans-serif;
      }
      div {
        font-family: "Roboto", sans-serif;
      }
  
      span {
        font-family: "Roboto", sans-serif;
      }
      a {
        font-family: "Roboto", sans-serif;
      }
  
      ::placeholder {
        font-family: "Roboto", sans-serif;
      }
      button {
        font-family: "Roboto", sans-serif;
      }
      html {
        font-family: "Roboto", sans-serif;
      }
      video {
        background-color: var(--main-bg-cool-rgb) !important;
      }
  
      body {
        font-family: Arial, sans-serif;
        background-color: #f4f4f4;
        line-height: 1.6;
      }
      div {
        border-radius: 10px;
      }
      .logoBox {
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .container {
        position: relative;
        background-color: #ffffff;
        padding: 2rem;
        max-width: 600px;
        margin: 2rem auto;
        border-radius: 10px;
        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
      }
      h1 {
        color: #333;
        font-size: 2rem;
        text-align: center;
        margin-bottom: 1rem;
      }
      p {
        font-size: 1.1rem;
        margin-bottom: 1rem;
      }
      a {
        text-decoration: none;
        color: #0a84ff;
      }
      .welco {
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
      .welco div {
        width: 80px;
        height: 80px;
  
        position: absolute;
      }
  
      .welco div img {
        width: 100%;
        height: 100%;
        object-fit: contain;
      }
      span {
        font-weight: 600;
        letter-spacing: 4px;
        background-image: linear-gradient(#2ecc71, #186a3b);
        background-clip: text;
        -webkit-background-clip: text;
        color: transparent;
      }
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
  
    <body>
      <div className="container">
        <div className="logoBox">
          <img
            src="https://myfitsta.com/static/media/logo.84ddd6d7.png"
            alt="MEETCODE Logo"
            width="150"
          />
        </div>
        <div>
          <h1>Welcome to <span>MEETCODE</span> 🚀</h1>
        </div>
  
        <p>
          Hey ${username}, welcome to MEETCODE! We're thrilled to have you join
          our community of fitness enthusiasts. Our platform is changing the game
          by providing tailored fitness programs for anyone to buy and sell.
          Connect with fellow users, explore our range of programs, and start
          achieving your fitness goals today!
        </p>
  
        <p>
          We are here to help you every step of the way, so don't hesitate to
          reach out if you need assistance or have any questions.
        </p>
        <a href="https://www.instagram.com" className="btn">Get Started</a>
  
        <tr>
          <div
            align="center"
            style="background-color: #1f2125; color: #ffffff; padding: 20px"
          >
            <p style="textfont-size: 16px; line-height: 1; margin: 0">
              This email was sent by MEETCODE. &copy; 2023 MEETCODE Inc.
            </p>
          </div>
        </tr>
      </div>
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
module.exports = sendNewUserEmail;
