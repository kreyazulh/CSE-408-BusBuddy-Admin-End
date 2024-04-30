var express = require('express');
var router = express.Router();

// Route to get station names
// usage : createRoute
router.get('/', (req, res) => {
  if (req.session.userId === null || req.session.userId === undefined) {
    res.send({
      auth: false,
    });
    return;
  };
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
    if (req.session.userId === null || req.session.userId === undefined) {
      res.send({
        auth: false,
      });
      return;
    };
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

  router.post('/save', (req, res) => {
    if (req.session.userId === null || req.session.userId === undefined) {
      res.send({
        auth: false,
      });
      return;
    };
    const client = req.client;
    const allocations = req.body.allocations;
    let updatePromises = [];

    // Iterate over the allocations array and execute update query for each element
    allocations.forEach((allocation) => {
        let queryText = "UPDATE schedule SET default_driver = $3, default_helper = $4, default_bus = $5 WHERE route = $1 AND time_type = $2";
        let queryParams = [allocation.route, allocation.shift, allocation.driver, allocation.staff, allocation.bus];
        updatePromises.push(client.query(queryText, queryParams));
    });

    // Wait for all the update promises to resolve
    Promise.all(updatePromises).then(results => {
        // Check if all updates were successful
        const allUpdated = results.every(result => result.rowCount === 1);
        if (allUpdated) {
            res.send(true);
        } else {
            res.send(false);
        }
    }).catch(e => {
        console.error(e.stack);
        res.send(false);
    });
});

      
  

  router.get('/allocatedBuses', (req, res) => {
    if (req.session.userId === null || req.session.userId === undefined) {
      res.send({
        auth: false,
      });
      return;
    };

    const client = req.client;
    let query = 'SELECT * FROM bus WHERE reg_id IN (SELECT default_bus FROM schedule  WHERE default_bus IS NOT NULL);';

  
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
    let query = 'SELECT * FROM bus WHERE reg_id NOT IN (SELECT default_bus FROM schedule WHERE default_bus IS NOT NULL);';

  
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
    if (req.session.userId === null || req.session.userId === undefined) {
      res.send({
        auth: false,
      });
      return;
    };
    const client = req.client;
    let query = `SELECT * FROM bus_staff WHERE id IN (SELECT default_driver FROM schedule WHERE default_driver IS NOT NULL) AND role = 'driver'`;

  
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
    if (req.session.userId === null || req.session.userId === undefined) {
      res.send({
        auth: false,
      });
      return;
    };
    const client = req.client;
    let query = `SELECT * FROM bus_staff WHERE id NOT IN (SELECT default_driver FROM schedule WHERE default_driver IS NOT NULL) AND role = 'driver'`;

  
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
    if (req.session.userId === null || req.session.userId === undefined) {
      res.send({
        auth: false,
      });
      return;
    };
    const client = req.client;
    let query = `SELECT * FROM bus_staff WHERE id IN (SELECT default_helper FROM schedule WHERE default_helper IS NOT NULL) AND role = 'collector'`;

  
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
    if (req.session.userId === null || req.session.userId === undefined) {
      res.send({
        auth: false,
      });
      return;
    };
    const client = req.client;
    let query = `SELECT * FROM bus_staff WHERE id NOT IN (SELECT default_helper FROM schedule WHERE default_helper IS NOT NULL) AND role = 'collector'`;

  
    client.query(query, (error, results) => {
      if (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
      } else {
        console.log(results);
        res.json(results.rows);
      }
    });
  });

  module.exports = router;