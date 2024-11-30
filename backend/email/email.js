import nodemailer from 'nodemailer';
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: "itsfakepunjabi@gmail.com",
      pass: "hmfnbnbqaixddblm",
    },
  });
  
  const sendEmail = async (to, subject, text, html) => {
    const mailOptions = {
      from: "itsfakepunjabi@gmail.com",
      to,
      subject,
      text, // Plain text fallback
      html, // HTML content
    };
  
    try {
      const info = await transporter.sendMail(mailOptions);
      console.log('Email sent:', info.response);
    } catch (error) {
      console.error('Error sending email:', error);
    }
  };
  
  const adminNotificationHTML = (email, eventTitle, date, startTime, endTime, departmentName, bookedBy) => `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; background-color: #f9f9f9; padding: 20px; border-radius: 8px; width: 100%; max-width: 600px; margin: 0 auto;">
      <div style="background-color: #ffffff; padding: 20px; border-radius: 8px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);">
        <h2 style="color: #2196F3; text-align: center;">New Booking Request</h2>
        <p style="font-size: 16px;">Dear Admin,</p>
        <p style="font-size: 16px;">A new booking request has been submitted. Here are the details:</p>
        <table style="width: 100%; margin-top: 20px; border-collapse: collapse;">
          <tr>
            <td style="padding: 10px; font-size: 14px; color: #555; font-weight: bold;">Submitted By:</td>
            <td style="padding: 10px; font-size: 14px; color: #555;">${email}</td>
          </tr>
          <tr>
            <td style="padding: 10px; font-size: 14px; color: #555; font-weight: bold;">Event Title:</td>
            <td style="padding: 10px; font-size: 14px; color: #555;">${eventTitle}</td>
          </tr>
          <tr>
            <td style="padding: 10px; font-size: 14px; color: #555; font-weight: bold;">Date:</td>
            <td style="padding: 10px; font-size: 14px; color: #555;">${date}</td>
          </tr>
          <tr>
            <td style="padding: 10px; font-size: 14px; color: #555; font-weight: bold;">Time:</td>
            <td style="padding: 10px; font-size: 14px; color: #555;">${startTime} to ${endTime}</td>
          </tr>
          <tr>
            <td style="padding: 10px; font-size: 14px; color: #555; font-weight: bold;">Department Name:</td>
            <td style="padding: 10px; font-size: 14px; color: #555;">${departmentName}</td>
          </tr>
          <tr>
            <td style="padding: 10px; font-size: 14px; color: #555; font-weight: bold;">Booked By:</td>
            <td style="padding: 10px; font-size: 14px; color: #555;">${bookedBy}</td>
          </tr>
        </table>
        <p style="font-size: 16px; margin-top: 20px;">Please review and take appropriate action.</p>
        <p style="font-size: 16px;">Best regards,<br>The Auditorium Management Team</p>
      </div>
    </div>
  `;
  
  
  
  const bookingConfirmationHTML = (eventTitle, date, startTime, endTime, departmentName, bookedBy) => `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; background-color: #f9f9f9; padding: 20px; border-radius: 8px; width: 100%; max-width: 600px; margin: 0 auto;">
      <div style="background-color: #ffffff; padding: 20px; border-radius: 8px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);">
        <h2 style="color: #4CAF50; text-align: center;">Booking Request Submitted</h2>
        <p style="font-size: 16px;">Dear User,</p>
        <p style="font-size: 16px;">Your request for booking the auditorium has been submitted successfully. Please find the details below:</p>
        <table style="width: 100%; margin-top: 20px; border-collapse: collapse;">
          <tr>
            <td style="padding: 10px; font-size: 14px; color: #555; font-weight: bold;">Event Title:</td>
            <td style="padding: 10px; font-size: 14px; color: #555;">${eventTitle}</td>
          </tr>
          <tr>
            <td style="padding: 10px; font-size: 14px; color: #555; font-weight: bold;">Date:</td>
            <td style="padding: 10px; font-size: 14px; color: #555;">${date}</td>
          </tr>
          <tr>
            <td style="padding: 10px; font-size: 14px; color: #555; font-weight: bold;">Time:</td>
            <td style="padding: 10px; font-size: 14px; color: #555;">${startTime} to ${endTime}</td>
          </tr>
          <tr>
            <td style="padding: 10px; font-size: 14px; color: #555; font-weight: bold;">Department Name:</td>
            <td style="padding: 10px; font-size: 14px; color: #555;">${departmentName}</td>
          </tr>
          <tr>
            <td style="padding: 10px; font-size: 14px; color: #555; font-weight: bold;">Booked By:</td>
            <td style="padding: 10px; font-size: 14px; color: #555;">${bookedBy}</td>
          </tr>
        </table>
        <p style="font-size: 16px; margin-top: 20px;">The request is currently pending approval. You will receive an update soon.</p>
        <p style="font-size: 16px;">Best regards,<br>The Auditorium Management Team</p>
      </div>
    </div>
  `;
  
  
  const statusUpdateHTML = (eventTitle, status, reason, approvedBy) => {
    let statusColor = '#F44336'; // Red (for rejected or canceled)
    let statusText = `Your booking for "${eventTitle}" has been rejected.`;
    let statusDetails = `<strong>Reason:</strong> ${reason || 'No reason provided.'}`;
  
    if (status === 'approved') {
      statusColor = '#4CAF50'; // Green for approved
      statusText = `Your booking for "${eventTitle}" has been approved by ${approvedBy}.`;
      statusDetails = ''; // No reason for approval
    } else if (status === 'pending') {
      statusColor = '#FFEB3B'; // Yellow for pending
      statusText = `Your booking for "${eventTitle}" is pending approval.`;
      statusDetails = ''; // No reason for pending
    }
  
    return `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; background-color: #f9f9f9; padding: 20px; border-radius: 8px; width: 100%; max-width: 600px; margin: 0 auto;">
        <div style="background-color: #ffffff; padding: 20px; border-radius: 8px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);">
          <h2 style="color: ${statusColor}; text-align: center;">${statusText}</h2>
          <p style="font-size: 16px;">Dear User,</p>
          <p style="font-size: 16px;">We wanted to update you on the status of your booking request. Please find the details below:</p>
          <table style="width: 100%; margin-top: 20px; border-collapse: collapse;">
            <tr>
              <td style="padding: 10px; font-size: 14px; color: #555; font-weight: bold;">Event Title:</td>
              <td style="padding: 10px; font-size: 14px; color: #555;">${eventTitle}</td>
            </tr>
            <tr>
              <td style="padding: 10px; font-size: 14px; color: #555; font-weight: bold;">Status:</td>
              <td style="padding: 10px; font-size: 14px; color: ${statusColor}; font-weight: bold;">${status}</td>
            </tr>
            ${statusDetails ? `
              <tr>
                <td style="padding: 10px; font-size: 14px; color: #555; font-weight: bold;">Reason:</td>
                <td style="padding: 10px; font-size: 14px; color: #555;">${reason}</td>
              </tr>` : ''}
          </table>
          <p style="font-size: 16px; margin-top: 20px;">If you have any questions or need further assistance, feel free to reach out.</p>
          <p style="font-size: 16px;">Best regards,<br>The Auditorium Management Team</p>
        </div>
      </div>
    `;
  };

  export { sendEmail, adminNotificationHTML,transporter, bookingConfirmationHTML,statusUpdateHTML};