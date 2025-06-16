
import sqlite3 from 'sqlite3';
import path from 'path';


console.log('Using database file:', path.resolve('mydata.db'));
const db = new sqlite3.Database(path.resolve('mydata.db'), (err) => {
  if (err) {
    console.error('Error opening database:', err);
  } else {
    console.log('Connected to SQLite database.');
  }
});

export default db;

