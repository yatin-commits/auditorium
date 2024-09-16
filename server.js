import express from 'express';
import cors from 'cors';
import mysql from 'mysql2';
import dotenv from 'dotenv';
dotenv.config()
const app = express();
const port = 4000;

app.use(cors());
app.use(express.json());

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

// API Endpoint to update profile
app.post('/dashboard/profile', (req, res) => {
  const { email, name } = req.body;

  if (!email || !name) {
    return res.status(400).json({ message: 'Email and name are required' });
  }

  const query = 'UPDATE users SET name = ? WHERE email = ?';

  db.query(query, [name, email], (err, result) => {
    if (err) {
      console.error('Error updating user profile:', err);
      return res.status(500).json({ message: 'Database error' });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ message: 'Profile updated successfully' });
  });
});

app.get('/api/all-requests', (req, res) => {
  const query = 'SELECT * FROM events'; // Adjust your table name as needed

  db.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Error fetching requests', error: err });
    }
    res.json(results);
  });
});


app.post('/api/update-status', (req, res) => {
  const { id, status } = req.body; 
  console.log(id,status);
  // 'id' is the booking request ID and 'status' can be 'approved' or 'rejected'
  
  const query = 'UPDATE events SET status = ? WHERE id = ?';
  db.query(query, [status, id], (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Error updating request status', error: err });
    }
    res.json({ message: 'Status updated successfully' });
  });
});



app.get('/api/past-bookings', (req, res) => {
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
      status
    FROM events
    WHERE email = ? 
    ORDER BY date DESC;  
  `;

  db.query(query, [email], (err, results) => {
    if (err) {
      console.error('Error fetching past bookings:', err.message);
      return res.status(500).json({ error: 'Error fetching past bookings' });
    }
    res.json(results);
  });
});

// API Endpoint to create user profile
app.post('/dashboard/', (req, res) => {
  const { email } = req.body;
  const name = 'tempname'; // Default name
  const role = 'teacher'; // Default role

  if (!email) {
    return res.status(400).json({ message: 'Email is required' });
  }

  const query = 'INSERT INTO users (email, name, role) VALUES (?, ?, ?)';

  db.query(query, [email, name, role], (err, result) => {
    if (err) {
      console.error('Error creating user profile:', err);
      return res.status(500).json({ message: 'Database error' });
    }

    res.json({ message: 'Profile created successfully' });
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
  const { email, event_title, event_description, date, start_time, end_time } = req.body;

  if (!email || !event_title || !date || !start_time || !end_time) {
    return res.status(400).json({ error: 'All fields are required.' });
  }

  const query = 'INSERT INTO events (email, event_title, event_description, date, start_time, end_time, status) VALUES (?, ?, ?, ?, ?, ?, "pending")';
  db.query(query, [email, event_title, event_description, date, start_time, end_time], (err, results) => {
    if (err) {
      console.error('Error inserting new booking:', err.message);
      return res.status(500).json({ error: 'Error booking event' });
    }
    res.json({ message: 'Booking request submitted successfully', bookingId: results.insertId });
  });
});

app.post('/addUser', (req, res) => {
  const { name,email } = req.body;
  // console.log(req.body);
  const query = 'INSERT INTO users (name,email) VALUES (?, ?)';
  db.query(query, [name,email], (err, result) => {
    if (err) {
      console.error('Error inserting user data:', err);
      return res.status(500).send('Error saving user data');
    }

    res.status(200).send('User data saved successfully');
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
