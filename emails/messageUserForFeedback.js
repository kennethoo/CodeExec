import sgMail from "@sendgrid/mail";
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

function messageUserForFeedback(email) {
  const msg = {
    to: email,
    from: "noreply@meettum.com",
    subject: `Welcome to Meettum! We Value Your Feedback`,
    text: `Hi there! 🎉🎉

 Sending you best wishes with this email! 

Welcome! The entire Meettum team is happy to have you here. We are grateful for your confidence in us and eager to ensure a smooth and satisfying experience for you.

The goal here at Meettum is to bring people together, encourage genuine connections, and create experiences that you won't soon forget.

We value your feedback highly since it helps us improve our platform and provide you with an even better experience. 

If you have any feedback regarding your first encounter with Meettum, we would greatly appreciate it.
Whether it's about the registration process, the user interface, or any specific features you've explored, your insights will help us tailor our platform to better suit your needs.

Please take a few moments to share your feedback by clicking on the following link:  Feedback Survey Link: https://forms.gle/MrzzfpqpBZYi4LvC8 Your input is invaluable to us, and we appreciate your time in helping us make Meettum the best it can be

Have a great day
`,
  };
  sgMail
    .send(msg)
    .then(() => {})
    .catch((error) => {
      console.error(error.response.body);
    });
}
module.exports = messageUserForFeedback;
