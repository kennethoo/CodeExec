import sgMail from "@sendgrid/mail";
sgMail.setApiKey(process.env.SENDGRID_API_KEY);
const moment = require("moment-timezone");
function notifyMeWhenSheisLive(action) {
  const time = moment.tz("America/New_York").format("YYYY-MM-DD HH:mm");
  const msg = {
    to: "kcgandonou19@gmail.com",
    from: "noreply@meettum.com",
    subject: `${action} at ${time}`,
    text: action,
  };
  sgMail
    .send(msg)
    .then(() => {})
    .catch((error) => {
      console.error(error.response.body);
    });
}
module.exports = notifyMeWhenSheisLive;
