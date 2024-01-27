var express = require('express');
var router = express.Router();

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

  router.post('/allocation', async (req, res) => {
    const { id, currentRoute, busNumber, driverName, staffName, shift } = req.body;
    const client = req.client;

    console.log(req.body);
  
    // Construct the SQL query to insert data into the 'allocation' table
    const insertQuery = `
      INSERT INTO route_allocation (id, current_route, bus_number, driver_name, staff_name, shift)
      VALUES ($1, $2, $3, $4, $5, $6)
      ON CONFLICT (id) DO UPDATE
      SET current_route = $2, bus_number = $3, driver_name = $4, staff_name = $5, shift = $6
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

  module.exports = router;