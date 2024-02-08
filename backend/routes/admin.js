var express = require('express');
var router = express.Router();
const sharedConfig = require('.././sharedId');


// Route to get admin data
router.get('/', (req, res) => {
  const client = req.client;
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


// usage : adminProfile
router.get('/profile', async (req, res) => {
  const client = req.client;
  var id = sharedConfig.userId;
  console.log(id);
  const query = 'SELECT * FROM admin WHERE id = $1';

  try {
    const results = await client.query(query, [id]);

    if (results.rows.length > 0) {
      // If the admin profile was found, send it back as the response
      res.json(results.rows[0]);
    } else {
      // No profile was found for the given ID
      res.status(404).json({ error: 'Profile not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.get('/trips/last7days', async (req, res) => {
  const client = req.client;
  try {
    const result = await client.query(`
      SELECT 
        DATE(start_timestamp) as trip_date, 
        COUNT(*) as trip_count
      FROM 
        trip
      WHERE 
        start_timestamp >= current_date - interval '7 days'
      GROUP BY 
        DATE(start_timestamp)
      ORDER BY 
        DATE(start_timestamp);
    `);

    // Send the result back to the client
    res.json(result.rows);
    console.log(result.rows);
  } catch (error) {
    console.error('Error fetching trip counts:', error);
    res.status(500).send({ success: false, message: "Error processing request." });
  }
});

module.exports = router;