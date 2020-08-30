const mysql = require('mysql');
require('dotenv').config();


const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    database: 'groupomania',
    password: process.env.DB_PASS
  });
  connection.connect();
  console.log("Connected to database Groupomania");
  module.exports = connection;