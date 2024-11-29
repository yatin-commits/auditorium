import express from 'express';
import cors from 'cors';
import mysql from 'mysql2';
import dotenv from 'dotenv';
dotenv.config()
const app = express();
const port = 4000;

app.use((req, res, next) => {
  res.setHeader('Cross-Origin-Opener-Policy', 'same-origin-allow-popups');
  next();
});
app.use(cors());
app.use(express.json());

app.use(cors({ origin: 'http://localhost:5173', credentials: true }));

app.use((req, res, next) => {
  res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
  res.setHeader('Cross-Origin-Embedder-Policy', 'unsafe-none');
  next();
});

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '1234', 
  database: 'auditorium_booking'  
});

db.connect((err) => {
  if (err) {
    console.error('Error connecting to the database:', err);
    return;
  }
  console.log('Connected to the MySQL database.');
});




app.get('/api/all-requests', (req, res) => {
  const query = 'SELECT * FROM events ORDER BY id desc;'; // Adjust your table name as needed

  db.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Error fetching requests', error: err });
    }
    res.json(results);
  });
});


app.post('/api/update-status', (req, res) => {
  const { id, status, reason, approved_by } = req.body; // Added 'approved_by'
  const query = `UPDATE events SET status = ?, rejection_reason = ?, approved_by = ? WHERE id = ?`;
  const rejectionReason = status === 'canceled' ? reason : null;

  db.query(query, [status, rejectionReason, approved_by, id], (err) => {
    if (err) {
      return res.status(500).json({ message: 'Error updating request status', error: err });
    }
    res.json({ message: 'Status updated successfully' });
  });
});





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
  ORDER BY id desc;
`;


  db.query(query, [email], (err, results) => {
    if (err) {
      console.error('Error fetching past bookings:', err.message);
      return res.status(500).json({ error: 'Error fetching past bookings' });
    }
    res.json(results);
  });
});



// Endpoint to fetch approved events
app.get('/api/approved-events', (req, res) => {
  const { date } = req.query;
  
  if (!date) {
    return res.status(400).json({ error: 'Date parameter is required.' });
  }

  // console.log('Received date:', date);  // Log the received date

  const query = `
    SELECT 
      events.event_title,
      events.start_time,
      events.end_time,
      events.date,
      events.status,
      events.approved_by,
      events. department_name,
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
    // console.log('Query results:', results);  // Log the query results
    res.json(results);
  });
});

// Endpoint to book an event
app.post('/api/book-event', (req, res) => {
  const { email, event_title, event_description, date, start_time, end_time, department_name,priority,bookedby} = req.body;

  if (!email || !event_title || !date || !start_time || !end_time || !department_name) {
    return res.status(400).json({ error: 'All fields are required.' });
  }

  const query = 'INSERT INTO events (email, event_title, event_description, date, start_time, end_time, status, department_name, priority, booked_by) VALUES (?, ?, ?, ?, ?, ?, "pending", ?, ?, ?)';
db.query(query, [email, event_title, event_description, date, start_time, end_time, department_name, priority, bookedby || null], (err, results) => {
  if (err) {
    console.error('Error inserting new booking:', err.message);
    return res.status(500).json({ error: 'Error booking event' });
  }
  res.json({ message: 'Booking request submitted successfully', bookingId: results.insertId });
});
});


app.post('/addUser', (req, res) => {
  const { name, email } = req.body;
  
  if (!email.endsWith('@bvicam.in') && email!="bvicamidforproject@gmail.com") {
    return res.status(400).send('Only @bvicam.in emails are allowed.');
  }
 
  const checkUserQuery = 'SELECT * FROM users WHERE email = ?';
  db.query(checkUserQuery, [email], (err, results) => {
    if (err) {
      console.error('Error checking user data:', err);
      return res.status(500).send('Error checking user data');
    }

    // If user already exists, skip insertion
    if (results.length > 0) {
      return res.status(200).send('User already exists, skipping insertion');
    }

    // If user does not exist, insert the new user
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


app.get('/getusername', (req, res) => {
  const { email } = req.query;

  if (!email) {
    return res.status(400).json({ error: 'Email parameter is required.' });
  }

  const query = 'SELECT name FROM users WHERE email = ?';

  db.query(query, [email], (err, results) => {
    // console.log(results);
    
    if (err) {
      console.error('Error fetching username:', err);
      return res.status(500).json({ error: 'Error fetching username' });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Send the username as a response
    res.json({ name: results[0].name });
  });
});


// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
