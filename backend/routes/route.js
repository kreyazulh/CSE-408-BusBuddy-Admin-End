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

  module.exports = router;