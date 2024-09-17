import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const transporter = nodemailer.createTransport({
  service: 'gmail', 
  auth: {
    user: import.meta.env.EMAIL_USER,   // Use process.env to access environment variables
    pass: import.meta.env.EMAIL_PASSWORD
  }
});

async function sendMail(to, subject, html) {
  const mailOptions = {
    from: import.meta.env.EMAIL_USER,
    to,
    subject,
    html
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Email sent successfully');
  } catch (error) {
    console.error('Error sending email:', error);
  }
}

export { sendMail };
