var Express = require('express');
var BodyParser = require('body-parser');
const dotenv = require('dotenv');
const cors = require('cors');
const session = require('express-session');
const cookieParser = require('cookie-parser');

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


var auth = require('./routes/auth');
var bus = require('./routes/bus');
var route = require('./routes/route');
var station = require('./routes/station');
var staff = require('./routes/staff');
var audit = require('./routes/admin');

app.use('/api/auth', auth);
app.use('/api/route', route);
app.use('/api/station', station);
app.use('/api/staff', staff);
app.use('/api/bus', bus);
app.use('/api/admin', audit);








