var Express = require('express');
var BodyParser = require('body-parser');
const dotenv = require('dotenv');
const cors = require('cors');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const bcrypt = require('bcrypt');

(async () => {
  const module = await import('node-fetch');
})();

var app = Express();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
dotenv.config();

const {Client} = require('pg');


const client = new Client({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME
});

client.connect();

app.listen(3000, ()=>{
    console.log("Server running on port 3000");
});

// Express middleware to parse JSON
app.use(BodyParser.json());
app.use(BodyParser.urlencoded({ extended: true }));
app.use(cookieParser());


app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  sameSite: 'none',
  cookie: {
      maxAge: 30*60*1000,
      httpOnly: true
  }
}));

// Define the middleware
app.use((req, res, next) => {
  req.client = client;
  next();
});

app.use((req, res, next) => {
  console.log(`Incoming request: ${req.method} ${req.path}`);
  next();
});


var auth = require('./routes/auth');
var bus = require('./routes/bus');
var route = require('./routes/route');
var trip = require('./routes/trip');
var station = require('./routes/station');
var staff = require('./routes/staff');
var audit = require('./routes/admin');
var user = require('./routes/user');
var feedback = require('./routes/feedback');
var requisition = require('./routes/requisition');
var notice = require('./routes/notice');

app.use('/api/auth', auth);
app.use('/api/route', route);
app.use('/api/trip', trip);
app.use('/api/station', station);
app.use('/api/staff', staff);
app.use('/api/bus', bus);
app.use('/api/admin', audit);
app.use('/api/user', user);
app.use('/api/feedback', feedback);
app.use('/api/requisition', requisition);
app.use('/api/notice', notice);



// (async () => {
//   try {
//     const hashedPassword = await bcrypt.hash("password", 10);
//     console.log(hashedPassword);
//   } catch (error) {
//     console.error('Error hashing password:', error);
//   }
// })();


app.post('/api/proxyGetTripData', async (req, res) => {
  console.log(req.body);

  try {
    // Call the other API
    const apiResponse = await fetch('http://3.141.62.8:6969/api/getTripData', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(req.body)
    });

    // Check if the request was successful
    if (!apiResponse.ok) {
      throw new Error(`API responded with status ${apiResponse.status}`);
    }

    // Parse the JSON from the API response
    const data = await apiResponse.json();

    // Send the data back to the frontend
    res.json(data);
  } catch (error) {
    // Handle any errors that occurred during the process
    console.error('Error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});


app.post('/api/proxyBroadcastNotification', async (req, res) => {
  console.log(req.body);

  try {
    // Validate input
    if (!req.body.nTitle || !req.body.nBody) {
      return res.status(400).json({ message: 'Missing notification title or body' });
    }

    // Call the external API to broadcast the notification
    const apiResponse = await fetch('http://3.141.62.8:6969/api/broadcastNotification', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        nTitle: req.body.nTitle,
        nBody: req.body.nBody
      })
    });

    // Check if the request was successful
    if (!apiResponse.ok) {
      throw new Error(`API responded with status ${apiResponse.status}`);
    }

    // Parse the JSON from the API response
    const data = await apiResponse.json();

    // Send the data back to the frontend
    res.json(data);
  } catch (error) {
    // Handle any errors that occurred during the process
    console.error('Error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});


app.post('/api/proxyPersonalNotification', async (req, res) => {
  console.log(req.body);

  try {
    // Validate input
    // if (!req.body.nTitle || !req.body.nBody || !req.body.user_id) {
    //   return res.status(400).json({ message: 'Missing notification title, body, or user ID' });
    // }

    // Call the external API to send the personal notification
    const apiResponse = await fetch('http://3.141.62.8:6969/api/personalNotification', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        nTitle: "New Trip Allocation",
        nBody: req.body.message,
        user_id: req.body.userId // Include the user ID in the request body
      })
    });

    // Check if the request was successful
    if (!apiResponse.ok) {
      throw new Error(`API responded with status ${apiResponse.status}`);
    }

    // Parse the JSON from the API response
    const data = await apiResponse.json();
    console.log(data);

    // Send the data back to the frontend
    res.json(data);
  } catch (error) {
    // Handle any errors that occurred during the process
    console.error('Error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});




module.exports = app;










