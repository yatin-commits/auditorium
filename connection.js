import mysql from 'mysql2';


const connection = mysql.createConnection({
  host: 'localhost', 
  user: 'root', 
  password: '1234',
  database: 'auditorium_booking', 
});


connection.connect((err) => {
  if (err) {
    console.error('Error connecting to the database:', err);
    return;
  }
  console.log('Connected to the MySQL database!');
});

export default connection;