var Express = require('express');
var BodyParser = require('body-parser');
const dotenv = require('dotenv');
const cors = require('cors');
const session = require('express-session');

var app = Express();

app.use(cors());
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


app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  sameSite: 'none',
  cookie: {
      maxAge: 60*30*1000,
      httpOnly: false
  }
}));



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
          req.session.user = id;
          res.json({ status: 'success' });
        } else {
          res.json({ status: 'fail' });
        }
      }
    });
  });

  const checkLoggedIn = (req, res, next) => {
    if (!req.session) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    next();
  };
  

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

app.post('/api/createroute', checkLoggedIn, async (req, res) => {
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

app.post('/api/logout',(req,res) => {
  req.session.destroy();
  res.send({
      success: true
  });
});

