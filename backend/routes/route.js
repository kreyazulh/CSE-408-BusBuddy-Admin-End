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

  router.get('/allocation', (req, res) => {
    const client = req.client;
    const query = 'SELECT * FROM allocation';
    
    client.query(query, (error, results) => {
      if (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
      } else {
        res.json(results.rows);
      }
    });
  });

  router.post('/allocation/add', async (req, res) => {
    const { date, route, shift, bus_id, driver, collector } = req.body;
    const client = req.client;
  
    console.log(req.body);
    
    const schedQuery = 'SELECT id FROM schedule WHERE route=$1 AND time_type=$2';
    const schedResult = await client.query(schedQuery, [route,shift]);
    const schedId = BigInt(schedResult.rows.map(row => row.id));

    // console.log(schedResult);
    console.log(schedId);
  
    // Construct the SQL query to insert data into the 'allocation' table
    const insertQuery = `CALL create_allocation($1,$2,$3,$4,$5,$6)`;
  
    try {
      // Execute the query
      await client.query(insertQuery, [schedId, date, bus_id, driver, collector, 'mashroor']);
      console.log("New Trip");
      res.json({ message: 'Allocation saved successfully' });
    } catch (error) {
      console.error('Error saving allocation:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

  router.post('/allocation/bulk', async (req, res) => {
    const { date } = req.body;
    const client = req.client;
  
    console.log(req.body);
  
    // Construct the SQL query to insert data into the 'allocation' table
    const insertQuery = `CALL update_allocation($1,$2)`;
  
    try {
      // Execute the query
      await client.query(insertQuery, [date, req.session.userId]);
      console.log("Bulk Trip");
      res.json({ message: 'Allocation saved successfully' });
    } catch (error) {
      console.error('Error saving allocation:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

  router.post('/allocation', async (req, res) => {
    const { id, currentRoute, busNumber, driverName, staffName, shift } = req.body;
    const client = req.client;
  
    console.log(req.body);
  
    // Format shift as an array literal
    const shiftArrayLiteral = `{${shift}}`;
    console.log(shiftArrayLiteral);
  
    // Construct the SQL query to insert data into the 'allocation' table
    const insertQuery = `
      INSERT INTO route_allocation (id, current_route, bus_number, driver_name, staff_name, shift)
      VALUES ($1, $2, $3, $4, $5, $6)
      ON CONFLICT (id) DO UPDATE
      SET current_route = $2, bus_number = $3, driver_name = $4, staff_name = $5, shift = $6
    `;
  
    try {
      // Execute the query
      await client.query(insertQuery, [id, currentRoute, busNumber, driverName, staffName, shiftArrayLiteral]);
      res.json({ message: 'Allocation saved successfully' });
    } catch (error) {
      console.error('Error saving allocation:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

  module.exports = router;