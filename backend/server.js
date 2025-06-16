// server.js
import db from './db.js';
import { handleSignUp } from './signUp.js';
import { handleLogin } from './login.js';
import http from 'http';
import nodemailer from 'nodemailer';
import { parse } from 'url';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'helina0943@gmail.com',
    pass: 'nani1995@1234#',
  },
});

const corsMiddleware = (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return true;
  }
  return false;
};

const server = http.createServer((req, res) => {
  console.log(`Incoming request: ${req.method} ${req.url}`);
  const parsedUrl = parse(req.url, true);

  const corsHandled = corsMiddleware(req, res);
  if (corsHandled) return;

  if (req.method === 'POST' && req.url === '/signup') {
    handleSignUp(req, res);

  } else if (req.method === 'POST' && req.url === '/login') {
    handleLogin(req, res);

  } else if (req.method === 'GET' && req.url === '/courses') {
    db.all('SELECT courseNo, courseName, courseImg, coursePrice, courseDes FROM Courses', [], (err, rows) => {
      if (err) {
        res.writeHead(500);
        res.end(JSON.stringify({ error: 'Database error' }));
      } else {
        const processed = rows.map(row => ({
          ...row,
          courseImg: row.courseImg ? Buffer.from(row.courseImg).toString('base64') : null
        }));
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(processed));
      }
    });

  } else if (req.method === 'GET' && req.url.startsWith('/courses/')) {
    const id = req.url.split('/')[2];

    db.get('SELECT courseNo, courseName, courseImg, courseDes, coursePrice, courseDoc, courseVideo FROM Courses WHERE courseNo = ?', [id], (err, row) => {
      if (err) {
        res.writeHead(500);
        res.end(JSON.stringify({ error: 'Database error' }));
      } else if (!row) {
        res.writeHead(404);
        res.end(JSON.stringify({ error: 'Course not found' }));
      } else {
        row.courseImg = row.courseImg ? Buffer.from(row.courseImg).toString('base64') : null;
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(row));
      }
    });

  } else if (req.method === 'GET' && req.url === '/consultation') {
    db.all('SELECT courseNo, courseName, courseDes, courseImg, courseConsPrice FROM Courses', [], (err, rows) => {
      if (err) {
        console.error("Database error:", err);
        res.writeHead(500);
        res.end(JSON.stringify({ error: 'Database error' }));
      } else {
        const processed = rows.map(row => ({
          ...row,
          courseImg: row.courseImg ? Buffer.from(row.courseImg).toString('base64') : null
        }));
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(processed));
      }
    });

  } else if (req.method === 'GET' && req.url.startsWith('/dashboard/')) {
    const userEmail = req.url.split('/')[2];
    console.log("Dashboard request for user:", userEmail);

    db.get('SELECT * FROM Users WHERE email = ?', [userEmail], (err, userRow) => {
      if (err) {
        res.writeHead(500);
        res.end(JSON.stringify({ error: 'Database error' }));
        return;
      }

      if (userRow) {
        let courseIds = [];

        if (userRow.course) {
          courseIds = userRow.course.toString().split(',').map(id => parseInt(id.trim(), 10));
        }

        if (courseIds.length === 0) {
          res.writeHead(404);
          res.end(JSON.stringify({ error: 'No courses found for this user' }));
          return;
        }

        const placeholders = courseIds.map(() => '?').join(',');

        db.all(
          `SELECT courseNo, courseName, courseDes, courseImg, courseConsPrice FROM Courses WHERE courseNo IN (${placeholders})`,
          courseIds,
          (err, courseRows) => {
            if (err) {
              res.writeHead(500);
              res.end(JSON.stringify({ error: 'Database error' }));
            } else {
              const processed = courseRows.map(row => ({
                ...row,
                courseImg: row.courseImg ? Buffer.from(row.courseImg).toString('base64') : null
              }));

              res.writeHead(200, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify(processed));
            }
          }
        );
      } else {
        res.writeHead(404);
        res.end(JSON.stringify({ error: 'User not found' }));
      }
    });

  } else if (req.method === 'POST' && req.url === '/enroll') {
    console.log("here");
    let body = '';

    req.on('data', chunk => {
      body += chunk.toString();
    });

    req.on('end', () => {
      try {
        const { email, courseId } = JSON.parse(body);

        if (!email || !courseId) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          return res.end(JSON.stringify({ success: false, message: 'Missing email or courseId' }));
        }

        db.get('SELECT course FROM Users WHERE email = ?', [email], (err, user) => {
          if (err) {
            console.error('Database error:', err);
            res.writeHead(500, { 'Content-Type': 'application/json' });
            return res.end(JSON.stringify({ success: false, message: 'Database error' }));
          }
        
          if (!user) {
            res.writeHead(404, { 'Content-Type': 'application/json' });
            return res.end(JSON.stringify({ success: false, message: 'User not found' }));
          }
        

          let currentCourses = user.course
            ? user.course.toString().split(',').map(id => parseInt(id.trim(), 10))
            : [];
        
      
          if (!currentCourses.includes(parseInt(courseId, 10))) {
            currentCourses.push(parseInt(courseId, 10));
          }
        
    
          const updatedCourses = currentCourses.join(',');
        
          db.run('UPDATE Users SET course = ? WHERE email = ?', [updatedCourses, email], function (err) {
            if (err) {
              console.error('Database update error:', err);
              res.writeHead(500, { 'Content-Type': 'application/json' });
              return res.end(JSON.stringify({ success: false, message: 'Failed to update courses' }));
            }
        
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: true, message: 'Enrollment successful!' }));
          });
        
        });
        

      } catch (error) {
        console.error('Error parsing JSON:', error);
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, message: 'Invalid request body' }));
      }
    });

  }else if (req.method === 'POST' && req.url === '/api/payment/initialize') {
    let body = '';
  
    req.on('data', chunk => {
      body += chunk.toString();
    });
  
    req.on('end', async () => {
      try {
        const requestData = JSON.parse(body);
        const https = await import('https');
  
        const chapaData = JSON.stringify({
          amount: requestData.amount,
          currency: "ETB",
          email: requestData.email,
          first_name: "Customer",
          last_name: "FromSite",
          tx_ref: "tx-" + Date.now(),
          callback_url: "http://localhost:4003/api/payment/verify",
          return_url: `http://localhost:5173/payment/success?courseId=${requestData.courseId}`,
          customization: {
            title: "Course Payment",
            description: "Payment for course enrollment"
          }
        });
  
        const options = {
          hostname: 'api.chapa.co',
          path: '/v1/transaction/initialize',
          method: 'POST',
          headers: {
            'Authorization': 'Bearer CHAPUBK_TEST-e7GHSOnXSUgN1P4LvFjqw2Fg4ntbt2lp',
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(postData)
          }
        };
  
        const chapaReq = https.default.request(options, chapaRes => {
          let data = '';
          chapaRes.on('data', chunk => data += chunk);
          chapaRes.on('end', () => {
            const parsed = JSON.parse(data);
            res.writeHead(200, { 'Content-Type': 'application/json' });
            if (parsed.status === "success" && parsed.data?.checkout_url) {
              res.writeHead(200, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({
                checkout_url: parsed.data.checkout_url,
                success: true
              }));
            } else {
              console.error("Chapa returned error:", parsed);
              
              if (!res.headersSent) {
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: parsed.message || "Chapa API failed" }));
              }
            }
            
            
          });
        });
  
        chapaReq.on('error', error => {
          console.error('Chapa request error:', error);
          res.writeHead(500, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Payment initialization failed' }));
        });
  
        chapaReq.write(chapaData);
        chapaReq.end();
      } catch (err) {
        console.error('Invalid JSON:', err);
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Invalid request body' }));
      }
    });
  }  
  else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not Found');
  }
});

server.listen(4003, () => {
  console.log('Server running at http://localhost:4003');
});

/*temp id:template_y9icspe
public key: k1D0YB_RMpI4eZFAL
user id : */

