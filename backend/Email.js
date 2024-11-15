import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const emailUser=import.meta.env.VITE_EMAIL_USER;
const emailPass=import.meta.env.VITE_EMAIL_PASS;
const transporter = nodemailer.createTransport({
  service: 'gmail', 
  auth: {
    user: emailUser,   // Use process.env to access environment variables
    pass: emailPass
  }
});

async function sendMail(to, subject, html) {
  const mailOptions = {
    from: emailUser,
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
