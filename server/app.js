const express = require('express');
const app = express();
const port = 3000;

const cors = require('cors');
const bodyParser = require('body-parser');
const mysql = require('mysql2');

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});

app.use(cors());
app.use(bodyParser.json());

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'todolist'
});

db.connect((err) => {
  if (err) throw err;
  console.log('Connected to database');
});
