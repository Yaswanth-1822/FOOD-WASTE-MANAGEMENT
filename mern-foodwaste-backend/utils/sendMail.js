const nodemailer = require('nodemailer');

const sendMail = async (to, subject, text) => {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_FROM,
        pass: process.env.EMAIL_PASS
      }
    });

    await transporter.sendMail({
      from: `"Food Waste Management" <${process.env.EMAIL_FROM}>`,
      to,
      subject,
      text
    });

    console.log('Mail sent to', to);
  } catch (error) {
    console.error('Error sending email:', error);
  }
};

module.exports = sendMail;
