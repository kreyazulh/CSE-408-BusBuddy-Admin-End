var express = require('express');
var router = express.Router();

// Route to get bus staff data
router.get('/', (req, res) => {
    const client = req.client;
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

  router.get('/driver', (req, res) => {
    const client = req.client;
    const query = 'SELECT * FROM bus_staff WHERE role=$1';
    
    client.query(query,['driver'],(error, results) => {
      if (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
      } else {
        res.json(results.rows);
      }
    });
  });

  router.get('/collector', (req, res) => {
    const client = req.client;
    const query = 'SELECT * FROM bus_staff WHERE role=$1';
    
    client.query(query,['collector'],(error, results) => {
      if (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
      } else {
        res.json(results.rows);
      }
    });
  });


  router.get('/:staffId', (req, res) => {
    const client = req.client;
    const { staffId } = req.params;
    const query = 'SELECT * FROM bus_staff WHERE id = $1';
    
    client.query(query, [staffId], (error, results) => {
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
        "INSERT INTO bus_staff(id, phone, password, role, name) values($1, $2, $3, $4, $5)",
        [req.body.id, req.body.phone, req.body.password, req.body.role, req.body.name]
    ).then(qres => {
        console.log(qres);
        if (qres.rowCount === 1) res.send(true);
        else if (qres.rowCount === 0) res.send(false);
    }).catch(e => {
        console.error(e.stack);
        res.send(false);
    });
});

module.exports = router;
