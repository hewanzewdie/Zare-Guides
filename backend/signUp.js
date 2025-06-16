// signUp.js
import db from './db.js';

export const handleSignUp = (req, res) => {
  let body = '';

  req.on('data', chunk => {
    body += chunk;
  });

  req.on('end', () => {
    try {
      const parsedData = JSON.parse(body);
      const { name, email, phoneno, password } = parsedData;

      const query = 'INSERT INTO Users (name, email, phoneno, password) VALUES (?, ?, ?, ?)';

      db.run(query, [name, email, phoneno, password], function (err) {
        if (err) {
          console.error('Error inserting user:', err.message);

          const isDuplicateEmail = err.message.includes('UNIQUE constraint failed: Users.email');

          res.writeHead(400, { 'Content-Type': 'application/json' });
          return res.end(
            JSON.stringify({
              message: isDuplicateEmail ? 'Email already exists.' : 'Error during sign-up.',
              error: err.message,
            })
          );
        }

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Sign-up successful!', user: { id: this.lastID } }));
      });
    } catch (error) {
      console.error('Invalid JSON format:', error.message);
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ message: 'Invalid request format.' }));
    }
  });
};
