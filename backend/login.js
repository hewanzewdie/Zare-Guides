import db from './db.js';

export const handleLogin = (req, res) => {
  let body = '';

  req.on('data', chunk => {
    body += chunk;
  });

  req.on('end', () => {
    try {
      const { email, password } = JSON.parse(body);

      const query = 'SELECT * FROM Users WHERE email = ? AND password = ?';

      db.get(query, [email, password], (err, row) => {
        if (err) {
          console.error('Error during login:', err);
          res.writeHead(500, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ success: false, error: 'Error during login.' }));
        } else if (row) {
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ success: true, user: row }));
        } else {
          res.writeHead(401, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ success: false, error: 'Invalid credentials.' }));
        }
      });
    } catch (parseError) {
      console.error('Invalid JSON:', parseError);
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: false, error: 'Invalid request format.' }));
    }
  });
};

