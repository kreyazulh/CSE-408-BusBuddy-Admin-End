var express = require('express');
var router = express.Router();

function getTomorrowsDate() {
  // Get the current time in GMT+6
  const today = new Date(new Date().toLocaleString('en-US', { timeZone: 'Etc/GMT-6' }));
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  // Format to YYYY-MM-DD
  return tomorrow.toISOString().split('T')[0];
}

// usage : createRoute, routeList, upcomingTrips 
router.get('/', async (req, res) => {
    const client = req.client;
    const query = 'SELECT id, terminal_point, points, valid, predefined_path,ARRAY(SELECT s.name FROM unnest(points) WITH ORDINALITY AS u(sid, ord) JOIN station s ON s.id = u.sid ORDER BY u.ord) AS name FROM route;';
    
    client.query(query, (error, results) => {
      if (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
      } else {
        res.json(results.rows);
      }
    });
  });


  // usage : createRoute,
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
  // usage : createRoute, routeList
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


  // usage : upcomingTrips
  router.get('/time', (req, res) => {
    try {
      const tomorrowsDateTime = getTomorrowsDate();
      res.json({ time: tomorrowsDateTime });
    } catch (error) {
      console.error('Error getting time:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

  router.post('/allocation', (req, res) => {
    const client = req.client;
    const date = req.body.date || getTomorrowsDate(); // Adjust to use body parser middleware
    console.log(date);
    let query = 'SELECT * FROM allocation';
  
    if (date) {
      query += ` WHERE DATE(start_timestamp) = '${date}'`;
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

  // usage : scheduleTrip
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

  // usage : scheduleTrip
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

  router.post('/allocation/edit', async (req, res) => {
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

  // usage : upcomingTrips
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


  router.post('/routeDetails/:routeId', async (req, res) => {
    const client = req.client;
    const { routeId } = req.params; // Extracting routeId from URL parameters

    // Check if routeId is provided
    if (!routeId) {
        return res.status(400).json({ error: 'Route ID is required.' });
    }

    // Query to fetch details for a specific route by ID, including station names and coords
    const query = `
        SELECT 
            id, 
            terminal_point, 
            points, 
            valid, 
            predefined_path,
            ARRAY(
                SELECT json_build_object('name', s.name, 'coords', s.coords) 
                FROM unnest(points) WITH ORDINALITY AS u(sid, ord) 
                JOIN station s ON s.id = u.sid 
                ORDER BY u.ord
            ) AS stations
        FROM route 
        WHERE id = $1;
    `;

    // Execute the query with routeId as the parameter
    client.query(query, [routeId], (error, results) => {
        if (error) {
            console.error('Error executing query:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        } else {
            // Check if the route exists
            if (results.rows.length > 0) {
                // Return the details of the route, including station names and coords
                res.json(results.rows[0]);
            } else {
                res.status(404).json({ error: 'Route not found' });
            }
        }
    });
});




  module.exports = router;