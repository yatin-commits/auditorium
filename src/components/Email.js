// backend/utils/emailService.js

import nodemailer from 'nodemailer'

// Configure the transporterp
const transporter = nodemailer.createTransport({
  service: 'Gmail', // Use your email service provider
  auth: {
    user: 'sharmayatin0882@gmail.com', // Replace with your email
    pass: 'jhlsgbknxzmdrfgm'  
  }
});

// Function to send an email to the admin
const sendBookingRequestEmail = (bookingDetails) => {
  const mailOptions = {
    from: 'itsfakepunjabi@gmail.com',
    to: 'sharmayatin0882@gmail.com', // Admin's email
    subject: 'New Auditorium Booking Request',
    html: `
      <h1>New Booking Request</h1>
      <p>Teacher: ${bookingDetails.teacherName}</p>
      <p>Event: ${bookingDetails.eventTitle}</p>
      <p>Date: ${bookingDetails.date}</p>
      <p>Time: ${bookingDetails.startTime} - ${bookingDetails.endTime}</p>
      <p>Description: ${bookingDetails.eventDescription}</p>
      <a href="http://yourwebsite.com/admin/approve?bookingId=${bookingDetails.id}">Approve</a> | 
      <a href="http://yourwebsite.com/admin/cancel?bookingId=${bookingDetails.id}">Cancel</a>
    `
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error sending email:', error);
    } else {
      console.log('Email sent:', info.response);
    }
  });
};

export default sendBookingRequestEmail
