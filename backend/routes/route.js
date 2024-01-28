var express = require('express');
var router = express.Router();

function getTomorrowsDate() {
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  return tomorrow.toISOString().split('T')[0];
}

router.get('/', async (req, res) => {
    const client = req.client;
    const routeQuery = 'SELECT * FROM route ORDER BY id ASC';
  
    try {
      const routeResults = await client.query(routeQuery);
      const routes = routeResults.rows;
  
      // Assuming that `points` is an array of station IDs
      for (let route of routes) {
        const pointsQuery = 'SELECT name FROM station WHERE id = ANY($1)';
        const pointsResult = await client.query(pointsQuery, [route.points]);
        route.names = pointsResult.rows.map(row => row.name);
      }
  
      res.json(routes);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

  
  router.post('/create', async (req, res) => {
    const client = req.client;
    try {
      const { terminal_point, names } = req.body;
  
      const countQuery = 'SELECT COUNT(*) FROM route';
      const countResult = await client.query(countQuery);
  
      const countValue = parseInt(countResult.rows[0].count, 10);
      const nextId = (countValue + 1).toString();
  
      const stationIdsQuery = 'SELECT id FROM station WHERE name = ANY($1::text[])';
      const stationIdsResult = await client.query(stationIdsQuery, [names]);
  
      const stationIds = stationIdsResult.rows.map(row => row.id);
  
      const insertQuery = 'INSERT INTO route (id, terminal_point, points) VALUES ($1, $2, $3) RETURNING *';
      const result = await client.query(insertQuery, [nextId, terminal_point, stationIds]);

      const schedQuery = 'CALL dummy_schedule($1, $2)';
      const schedResult = await client.query(schedQuery, [nextId, stationIds]);

  
      res.json({ status: 'success', route: result.rows[0] });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

  // Route to delete a bus route
router.delete('/delete/:routeId', async (req, res) => {
    const client = req.client;
    const { routeId } = req.params;
    const deleteQuery = 'DELETE FROM route WHERE id = $1';
  
    try {
      const deleteResult = await client.query(deleteQuery, [routeId]);
      if (deleteResult.rowCount > 0) {
        res.json({ message: 'Route deleted successfully' });
      } else {
        res.status(404).json({ error: 'Route not found' });
      }
    } catch (error) {
      console.error('Error deleting route:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });


  router.get('/time', (req, res) => {
    try {
      const tomorrowsDateTime = getTomorrowsDate();
      res.json({ time: tomorrowsDateTime });
    } catch (error) {
      console.error('Error getting time:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });


  router.get('/allocation', (req, res) => {
    const client = req.client;
    const date = req.query.date || getTomorrowsDate();
    console.log(date);
    let query = 'SELECT * FROM allocation';
  
    // If a date is provided, add a WHERE clause to filter by that date
    if (date) {
      query += ` WHERE DATE(start_timestamp) = '${date}'`; // Replace 'timestamp_column' with your actual column name
    }
  
    client.query(query, (error, results) => {
      if (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
      } else {
        res.json(results.rows);
      }
    });
  });

  router.post('/allocation', async (req, res) => {
    const { id, currentRoute, busNumber, driverName, staffName, shift } = req.body;
    const client = req.client;
  
    console.log(req.body);
  
    // Construct the SQL query to insert data into the 'allocation' table
    const insertQuery = `
      INSERT INTO allocation (id, route, bus, driver, helper, time_type)
      VALUES ($1, $2, $3, $4, $5, $6)
      ON CONFLICT (id) DO UPDATE
      SET route = $2, bus = $3, driver = $4, helper = $5, time_type = $6
    `;
  
    try {
      // Execute the query
      await client.query(insertQuery, [id, currentRoute, busNumber, driverName, staffName, shift]);
      res.json({ message: 'Allocation saved successfully' });
    } catch (error) {
      console.error('Error saving allocation:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

  router.post('/allocation/delete', async (req, res) => {
    const { id } = req.body; // assuming the ID is sent in the request body
    const client = req.client;

    console.log(req.body);
  
    // Construct the SQL query to delete data from the 'allocation' table
    const deleteQuery = `
      DELETE FROM allocation
      WHERE id = $1
    `;
  
    try {
      // Execute the query
      const result = await client.query(deleteQuery, [id]);
      
      // Check if the allocation was found and deleted
      if (result.rowCount === 0) {
        return res.status(404).json({ message: 'Allocation not found' });
      }
  
      res.json({ message: 'Allocation deleted successfully' });
    } catch (error) {
      console.error('Error deleting allocation:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

  module.exports = router;