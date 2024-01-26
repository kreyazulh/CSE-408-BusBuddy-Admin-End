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

module.exports = router;