var express = require('express');
var router = express.Router();

// Route to get station names
// usage : createRoute
router.get('/', (req, res) => {
    const client = req.client;
    let query = 'SELECT * FROM schedule';

  
    client.query(query, (error, results) => {
      if (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
      } else {
        res.json(results.rows);
      }
    });
  });

  router.post('/update', (req, res) => {
    const client = req.client;
      console.log(req.body);
      client.query (
          "UPDATE schedule SET default_driver = $3,default_helper = $4,default_bus = $5 WHERE route = $1 AND time_type = $2;",
          [req.body.route, req.body.shift, req.body.driver, req.body.helper, req.body.bus]
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
    let query = 'SELECT * FROM bus WHERE reg_id IN (SELECT default_bus FROM schedule);';

  
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
    let query = 'SELECT * FROM bus WHERE reg_id NOT IN (SELECT default_bus FROM schedule);';

  
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
    let query = `SELECT * FROM bus_staff WHERE id IN (SELECT default_driver FROM schedule) AND role = 'driver'`;

  
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
    let query = `SELECT * FROM bus_staff WHERE id NOT IN (SELECT default_driver FROM schedule) AND role = 'driver'`;

  
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
    let query = `SELECT * FROM bus_staff WHERE id IN (SELECT default_helper FROM schedule) AND role = 'collector'`;

  
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
    let query = `SELECT * FROM bus_staff WHERE id NOT IN (SELECT default_helper FROM schedule) AND role = 'collector'`;

  
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