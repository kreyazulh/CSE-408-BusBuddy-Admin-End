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

app.use('/api/auth', auth);
app.use('/api/route', route);
app.use('/api/trip', trip);
app.use('/api/station', station);
app.use('/api/staff', staff);
app.use('/api/bus', bus);
app.use('/api/admin', audit);
app.use('/api/user', user);
app.use('/api/feedback', feedback);



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




module.exports = app;


// {
//   success: true,
//   id: '1924',
//   start_timestamp: '2024-01-31T10:58:29.913Z',
//   route: '2',
//   time_type: 'morning',
//   time_list: [
//     { station: '12', time: null },
//     { station: '13', time: null },
//     { station: '14', time: null },
//     { station: '15', time: null },
//     { station: '16', time: null },
//     { station: '70', time: null }
//   ],
//   travel_direction: 'to_buet',
//   bus: 'Ba-22-4326',
//   is_default: true,
//   driver: 'rafiqul',
//   helper: 'jamal7898',
//   approved_by: null,
//   end_timestamp: null,
//   start_location: { latitude: '23.7481383', longitude: '90.3800983' },
//   end_location: null,
//   path: [
//     { latitude: '23.747948333333333', longitude: '90.38021' },
//     { latitude: '23.74714', longitude: '90.38071' },
//     { latitude: '23.746336666666668', longitude: '90.381165' },
//     { latitude: '23.745058333333333', longitude: '90.381905' }
//   ],
//   passenger_count: 0
// }








