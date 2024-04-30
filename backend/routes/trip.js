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

  
  router.post('/create', async (req, res) => {
    if (req.session.userId === null || req.session.userId === undefined) {
      res.send({
        auth: false,
      });
      return;
    };
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
  if (req.session.userId === null || req.session.userId === undefined) {
    res.send({
      auth: false,
    });
    return;
  };
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
    if (req.session.userId === null || req.session.userId === undefined) {
      res.send({
        auth: false,
      });
      return;
    };
    try {
      const tomorrowsDateTime = getTomorrowsDate();
      res.json({ time: tomorrowsDateTime });
    } catch (error) {
      console.error('Error getting time:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

  // usage : pastTrips
  router.get('/', (req, res) => {
    if (req.session.userId === null || req.session.userId === undefined) {
      res.send({
        auth: false,
      });
      return;
    };
    const client = req.client;
    let query = 'SELECT * FROM trip';

  
    client.query(query, (error, results) => {
      if (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
      } else {
        res.json(results.rows);
      }
    });
  });

  // usage : pastTrips
  router.post('/delete', async (req, res) => {
    if (req.session.userId === null || req.session.userId === undefined) {
      res.send({
        auth: false,
      });
      return;
    };
    const { id } = req.body; // assuming the ID is sent in the request body
    const client = req.client;
  
    // Construct the SQL query to delete data from the 'allocation' table
    const deleteQuery = `
      DELETE FROM trip
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

  // usage : map
  router.get('/tracking', async (req, res) => {
    if (req.session.userId === null || req.session.userId === undefined) {
      res.send({
        auth: false,
      });
      return;
    };
    const client = req.client;
    const { tripId } = req.query;  // Assuming you're passing a tripId as a query parameter
    console.log(tripId);
  
    // Construct the SQL query to fetch the allocation data
    // Using parameterized query for 'tripId'
    const query = `
      SELECT path FROM trip
      WHERE id = $1
    `;
  
    try {
      // Execute the query with the tripId from the query parameters
      const result = await client.query(query, [tripId]);
      console.log(result);
      res.json(result.rows);
    } catch (error) {
      console.error('Error fetching trip data:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

  router.get('/validTripId', (req, res) => {
    if (req.session.userId === null || req.session.userId === undefined) {
      res.send({
        auth: false,
      });
      return;
    };
    const client = req.client;
    let query = 'SELECT * FROM trip WHERE path IS NOT NULL';

  
    client.query(query, (error, results) => {
      if (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
      } else {
        console.log(results.rows);
        res.json(results.rows);
      }
    });
  });

  router.get('/validTripId/:tripId', (req, res) => {
    if (req.session.userId === null || req.session.userId === undefined) {
      res.send({
        auth: false,
      });
      return;
    };
    const client = req.client;
    const { tripId } = req.params;
    let query = 'SELECT * FROM trip WHERE id = $1 AND path IS NOT NULL';
  
    client.query(query, [tripId], (error, results) => {
      if (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
      } else {
        console.log(results.rows);
        res.json(results.rows);
      }
    });
  });

  router.get('/liveTrips', (req, res) => {
    if (req.session.userId === null || req.session.userId === undefined) {
      res.send({
        auth: false,
      });
      return;
    };
    const client = req.client;
    let query = 'SELECT * FROM trip WHERE is_live=\'true\'';

  
    client.query(query, (error, results) => {
      if (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
      } else {
        res.json(results.rows);
      }
    });
  });

  router.get('/remind', async (req, res) => {
    if (req.session.userId === null || req.session.userId === undefined) {
      res.send({
        auth: false,
      });
      return;
    };
    try {
      const client = req.client;
  
      // Query to get live trip IDs
      const liveTripsQuery = 'SELECT id FROM trip WHERE is_live = true';
      const liveTripsResult = await client.query(liveTripsQuery);
      const liveTripIDs = liveTripsResult.rows.map(row => row.id);
  
      // Ensure the IDs are passed as an array
      if (liveTripIDs.length === 0) {
        liveTripIDs.push(0); // Ensuring the array is never empty to avoid SQL errors
      }
  
      // Query to find overdue, non-live trips
      const overdueQuery = `
        SELECT id, start_timestamp, route, time_type, bus, driver, helper,
          EXTRACT(EPOCH FROM (NOW() - start_timestamp)) AS overdue_seconds
        FROM allocation
        WHERE start_timestamp < NOW() AND id != ALL($1)
      `;
      const values = [liveTripIDs]; // Pass array directly
  
      const overdueResults = await client.query(overdueQuery, values);
  
      // Respond with overdue trip details
      res.json(overdueResults.rows.map(row => ({
        id: row.id,
        start_timestamp: row.start_timestamp,
        route: row.route,
        time_type: row.time_type,
        bus: row.bus,
        driver: row.driver,
        helper: row.helper,
        overdue_seconds: row.overdue_seconds
      })));
      console.log(overdueResults.rows);
    } catch (error) {
      console.error('Error fetching reminder data:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });




  module.exports = router;