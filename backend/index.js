var Express = require('express');
var BodyParser = require('body-parser');
const dotenv = require('dotenv');
const cors = require('cors');

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



// Route to handle login
app.post('/api/login', (req, res) => {
    const { id, password } = req.body;
    const query = 'SELECT * FROM admin WHERE id = $1 AND password = $2';
  
    client.query(query, [id, password], (error, results) => {
      if (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
      } else {
        console.log(results);
        if (results.rowCount === 1) {
            console.log(results.rows);
            console.log(res);
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


