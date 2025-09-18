import sgMail from "@sendgrid/mail";
sgMail.setApiKey(process.env.SENDGRID_API_KEY);
const fs = require("fs");

function digitalProduct({ email, jobId, type, name, extension }) {
  pathToAttachment = `./tempFile/${jobId}.${extension}`;
  attachment = fs.readFileSync(pathToAttachment).toString("base64");
  const msg = {
    attachments: [
      {
        content: attachment,
        filename: name,
        type,
        disposition: "attachment",
      },
    ],
    to: email,
    from: "noreply@meettum.com",
    subject: "Digital Product attachment ",
    text: "Digital Product attachment",
    html: `<!DOCTYPE html>
<html>
<head>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
            background-color: #f4f4f4;
        }
        .container {
            width: 100%;
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            padding: 20px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }
        .header {
            background-color: #4CAF50;
            color: white;
            text-align: center;
            padding: 10px 0;
        }
        .content {
            padding: 20px;
        }
        .footer {
            text-align: center;
            color: #777;
            font-size: 12px;
            padding: 10px 0;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Attachment</h1>
        </div>
        <div class="content">
            <p>Hi</p>
            <p>Please find the attached document as requested.</p>
            <p>If you have any questions or need further assistance, feel free to contact us.</p>
            <p>Thank you!</p>
            <p>Sincerely,</p>
            <p>Meettum</p>
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
module.exports = digitalProduct;
