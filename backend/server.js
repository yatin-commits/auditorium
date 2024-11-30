import express from 'express';
import cors from 'cors';
import mysql from 'mysql2';
import dotenv from 'dotenv';
import { sendEmail, adminNotificationHTML,transporter, bookingConfirmationHTML,statusUpdateHTML} from './Email/email.js'

dotenv.config();
const app = express();
const port = 4000;

// Middleware
app.use((req, res, next) => {
  res.setHeader('Cross-Origin-Opener-Policy', 'same-origin-allow-popups');
  next();
});
app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(express.json());

// MySQL Database Connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '1234',
  database: 'auditorium_booking',
});

db.connect((err) => {
  if (err) {
    console.error('Error connecting to the database:', err);
    return;
  }
  console.log('Connected to the MySQL database.');
});


app.get('/api/all-requests', (req, res) => {
  const query = 'SELECT * FROM events ORDER BY id DESC;';
  db.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Error fetching requests', error: err });
    }
    res.json(results);
  });
});
app.post('/api/update-status', async (req, res) => {
  const { id, status, reason, approved_by } = req.body;

  // Query to update the status in the database
  const query = `UPDATE events SET status = ?, rejection_reason = ?, approved_by = ? WHERE id = ?`;
  const rejectionReason = status === 'canceled' ? reason : null;

  // Update the status in the database
  db.query(query, [status, rejectionReason, approved_by, id], async (err) => {
    if (err) {
      return res.status(500).json({ message: 'Error updating request status', error: err });
    }

    // Fetch details of the booking for email
    const fetchBookingQuery = `SELECT email, event_title FROM events WHERE id = ?`;
    db.query(fetchBookingQuery, [id], async (fetchErr, results) => {
      if (fetchErr) {
        console.error('Error fetching booking details:', fetchErr.message);
        return res.status(500).json({ error: 'Error fetching booking details for email' });
      }

      if (results.length === 0) {
        return res.status(404).json({ error: 'Booking not found' });
      }

      const { email, event_title } = results[0];

      // Construct the email content
      const subject = `Status Update for Your Booking: "${event_title}"`;
      const text =
        status === 'approved'
          ? `Your booking for "${event_title}" has been approved by ${approved_by}.`
          : `Your booking for "${event_title}" has been rejected. Reason: ${rejectionReason || 'No reason provided.'}`;

      // Send email to the user (teacher)
      try {
        await transporter.sendMail({
          from: "itsfakepunjabi@gmail.com", // Replace with your email
          to: email,
          subject: subject,
          text: text,
          html: statusUpdateHTML(event_title, status, rejectionReason, approved_by || 'N/A'), // HTML content
        });

        console.log(`Status update email sent to ${email}`);
      } catch (emailErr) {
        console.error('Error sending status update email:', emailErr);
        return res.status(500).json({ error: 'Error sending status update email' });
      }

      // Send a response back to the client
      res.json({ message: 'Status updated successfully and email sent' });
    });
  });
});



// Fetch past bookings for a user
app.get('/past-bookings', (req, res) => {
  const { email } = req.query;
  if (!email) {
    return res.status(400).json({ error: 'Email parameter is required.' });
  }

  const query = `
    SELECT 
      event_title,
      event_description,
      date,
      start_time,
      end_time,
      status,
      rejection_reason,
      priority,
      department_name
    FROM events
    WHERE email = ?
    ORDER BY id DESC;
  `;

  db.query(query, [email], (err, results) => {
    if (err) {
      console.error('Error fetching past bookings:', err.message);
      return res.status(500).json({ error: 'Error fetching past bookings' });
    }
    res.json(results);
  });
});

// Fetch approved events
app.get('/api/approved-events', (req, res) => {
  const { date } = req.query;
  if (!date) {
    return res.status(400).json({ error: 'Date parameter is required.' });
  }

  const query = `
    SELECT 
      events.event_title,
      events.start_time,
      events.end_time,
      events.date,
      events.status,
      events.approved_by,
      events.department_name,
      events.booked_by,
      users.name AS teacher_name
    FROM events
    JOIN users ON events.email = users.email
    WHERE events.date = ? AND events.status = 'approved';
  `;

  db.query(query, [date], (err, results) => {
    if (err) {
      console.error('Error fetching approved events:', err.message);
      return res.status(500).json({ error: 'Error fetching approved events' });
    }
    res.json(results);
  });
});

// Book an event
app.post('/api/book-event', (req, res) => {
  const { email, event_title, event_description, date, start_time, end_time, department_name, priority, bookedby } = req.body;

  if (!email || !event_title || !date || !start_time || !end_time || !department_name) {
    return res.status(400).json({ error: 'All fields are required.' });
  }

  const query =
    'INSERT INTO events (email, event_title, event_description, date, start_time, end_time, status, department_name, priority, booked_by) VALUES (?, ?, ?, ?, ?, ?, "pending", ?, ?, ?)';

  db.query(query, [email, event_title, event_description, date, start_time, end_time, department_name, priority, bookedby || null], (err, results) => {
    if (err) {
      console.error('Error inserting new booking:', err.message);
      return res.status(500).json({ error: 'Error booking event' });
    }

    // Send email notifications
    sendEmail(
      email,
      'Booking Request Submitted',
      `Your request for booking the auditorium (${event_title}) has been submitted.`,
      bookingConfirmationHTML(event_title, date, start_time, end_time, department_name, bookedby || 'N/A')
    );
    
    sendEmail(
      'sharmayatin0882@gmail.com', // Replace with the admin's email
      'New Booking Request',
      `A new booking request has been submitted.`,
      adminNotificationHTML(email, event_title, date, start_time, end_time, department_name, bookedby || 'N/A')
    );
    
    

    res.json({ message: 'Booking request submitted successfully', bookingId: results.insertId });
  });
});

// Add a user
app.post('/addUser', (req, res) => {
  const { name, email } = req.body;

  if (!email.endsWith('@bvicam.in') && email !== 'bvicamidforproject@gmail.com') {
    return res.status(400).send('Only @bvicam.in emails are allowed.');
  }

  const checkUserQuery = 'SELECT * FROM users WHERE email = ?';
  db.query(checkUserQuery, [email], (err, results) => {
    if (err) {
      console.error('Error checking user data:', err);
      return res.status(500).send('Error checking user data');
    }

    if (results.length > 0) {
      return res.status(200).send('User already exists, skipping insertion');
    }

    const insertUserQuery = 'INSERT INTO users (name, email) VALUES (?, ?)';
    db.query(insertUserQuery, [name, email], (err) => {
      if (err) {
        console.error('Error inserting user data:', err);
        return res.status(500).send('Error saving user data');
      }

      res.status(200).send('User data saved successfully');
    });
  });
});

// Fetch username by email
app.get('/getusername', (req, res) => {
  const { email } = req.query;

  if (!email) {
    return res.status(400).json({ error: 'Email parameter is required.' });
  }

  const query = 'SELECT name FROM users WHERE email = ?';

  db.query(query, [email], (err, results) => {
    if (err) {
      console.error('Error fetching username:', err);
      return res.status(500).json({ error: 'Error fetching username' });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ name: results[0].name });
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
// Middleware
app.use((req, res, next) => {
  res.setHeader('Cross-Origin-Opener-Policy', 'same-origin-allow-popups');
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:5173');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  next();
});







