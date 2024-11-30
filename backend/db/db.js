export const db = mysql.createConnection({
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