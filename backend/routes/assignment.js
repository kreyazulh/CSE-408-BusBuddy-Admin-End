var express = require('express');
var router = express.Router();

// Route to get station names
// usage : createRoute
router.get('/', (req, res) => {
    const client = req.client;
    let query = 'SELECT * FROM assignment';

  
    client.query(query, (error, results) => {
      if (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
      } else {
        res.json(results.rows);
      }
    });
  });

  router.post('/add', (req, res) => {
    const client = req.client;
      console.log(req.body);
      client.query (
          "INSERT INTO assignment (route, bus, driver, helper, start_time, shift) VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP, $5);",
          [req.body.route, req.body.bus, req.body.driver, req.body.helper, req.body.shift]
      ).then(qres => {
          console.log(qres);
          if (qres.rowCount === 1) res.send(true);
          else if (qres.rowCount === 0) res.send(false);
      }).catch(e => {
          console.error(e.stack);
          res.send(false);
      });
  });

  router.get('/allocatedBuses', (req, res) => {
    const client = req.client;
    let query = 'SELECT * FROM bus WHERE reg_id IN (SELECT bus FROM assignment);';

  
    client.query(query, (error, results) => {
      if (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
      } else {
        res.json(results.rows);
      }
    });
  });

  router.get('/unallocatedBuses', (req, res) => {
    const client = req.client;
    let query = 'SELECT * FROM bus WHERE reg_id NOT IN (SELECT bus FROM assignment);';

  
    client.query(query, (error, results) => {
      if (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
      } else {
        res.json(results.rows);
      }
    });
  });

  router.get('/allocatedDrivers', (req, res) => {
    const client = req.client;
    let query = `SELECT * FROM bus_staff WHERE id IN (SELECT driver FROM assignment) AND role = 'driver'`;

  
    client.query(query, (error, results) => {
      if (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
      } else {
        res.json(results.rows);
      }
    });
  });

  router.get('/unallocatedDrivers', (req, res) => {
    const client = req.client;
    let query = `SELECT * FROM bus_staff WHERE id NOT IN (SELECT driver FROM assignment) AND role = 'driver'`;

  
    client.query(query, (error, results) => {
      if (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
      } else {
        res.json(results.rows);
      }
    });
  });

  router.get('/allocatedHelpers', (req, res) => {
    const client = req.client;
    let query = `SELECT * FROM bus_staff WHERE id IN (SELECT helper FROM assignment) AND role = 'collector'`;

  
    client.query(query, (error, results) => {
      if (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
      } else {
        res.json(results.rows);
      }
    });
  });

  router.get('/unallocatedHelpers', (req, res) => {
    const client = req.client;
    let query = `SELECT * FROM bus_staff WHERE id NOT IN (SELECT helper FROM assignment) AND role = 'collector'`;

  
    client.query(query, (error, results) => {
      if (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
      } else {
        res.json(results.rows);
      }
    });
  });

  module.exports = router;