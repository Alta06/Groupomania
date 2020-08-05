const mysql = require('mysql');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    database: 'groupomania',
    password: 'Mdppmsql.com1'
  });
  connection.connect();
  console.log("Connected to database Groupomania");
  module.exports = connection;