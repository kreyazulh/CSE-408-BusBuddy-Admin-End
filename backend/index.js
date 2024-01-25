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

const {Pool, Client} = require('pg');


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

// app.get('/admins', (req, res)=>{
//     client.query(`Select * from admin`, (err, result)=>{
//         if(!err){
//             res.send(result.rows);
//         }
//     });
//     client.end;
// });

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


app.get('/api/check-session', (req, res) => {
  console.log(req.session);
  console.log(req.session.userId);
  res.json({ isAuthenticated: !!req.session.userId });
});

// Route to handle login
app.post('/api/login', (req, res) => {
    const { id, password } = req.body;
    const query = 'SELECT * FROM admin WHERE id = $1 AND password = $2';
  
    client.query(query, [id, password], (error, results) => {
      if (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
      } else {
        if (results.rowCount === 1) {
          req.session.userId = id;
          res.json({ status: 'success' });
        } else {
          res.json({ status: 'fail' });
        }
      }
    });
  });

  

// Route to get admin data
app.get('/api/admins', (req, res) => {
  const query = 'SELECT * FROM admin';
  
  client.query(query, (error, results) => {
    if (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      res.json(results.rows);
    }
  });
});

// Route to get bus data
app.get('/api/bus', (req, res) => {
  const query = 'SELECT * FROM bus';
  
  client.query(query, (error, results) => {
    if (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      res.json(results.rows);
    }
  });
});

// Route to add bus data
app.post('/api/bus/add', (req, res) => {
      console.log(req.body);
      client.query (
          "INSERT INTO bus(reg_id, type, capacity) values($1, $2, $3)",
          [req.body.reg_id, req.body.type, req.body.capacity]
      ).then(qres => {
          console.log(qres);
          if (qres.rowCount === 1) res.send(true);
          else if (qres.rowCount === 0) res.send(false);
      }).catch(e => {
          console.error(e.stack);
          res.send(false);
      });
});

// Route to get bus staff data
app.get('/api/bus_staff', (req, res) => {
  const query = 'SELECT * FROM bus_staff';
  
  client.query(query, (error, results) => {
    if (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      res.json(results.rows);
    }
  });
});

app.post('/api/createroute', async (req, res) => {
  try {
    const { id, terminal_point, names } = req.body;

    // Example query to find station IDs for each station name
    const stationIdsQuery = 'SELECT id FROM station WHERE name = ANY($1::text[])';
    const stationIdsResult = await client.query(stationIdsQuery, [names]);

    // Extract station IDs from the result
    const stationIds = stationIdsResult.rows.map(row => row.id);
    console.log(stationIds);

    // Example query to insert a new route into the database with station IDs
    const insertQuery = 'INSERT INTO route (id, terminal_point, points) VALUES ($1, $2, $3) RETURNING *';
    const result = await client.query(insertQuery, [id, terminal_point, stationIds]);

    res.json({ status: 'success', route: result.rows[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Route to get station names
app.get('/api/stations', async (req, res) => {
  try {
      // Example query to fetch names from the station table
      const query = 'SELECT name FROM station';
      const result = await client.query(query);

      res.json(result.rows);
  } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/api/logout', (req, res) => {
  req.session.destroy((error) => {
      if (error) {
          console.error(error);
          res.status(500).json({ error: 'Internal Server Error' });
      } else {
          res.json({ status: 'success' });
      }
  });
});

