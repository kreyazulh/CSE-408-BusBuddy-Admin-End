var express = require('express');
var router = express.Router();

// Route to get station names
// usage : createRoute
router.get('/name', async (req, res) => {
    if (req.session.userId === null || req.session.userId === undefined) {
        res.send({
          auth: false,
        });
        return;
      };
    const client = req.client;
    try {
        const query = 'SELECT name FROM station';
        const result = await client.query(query);
  
        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
  });

  router.get('/', async (req, res) => {
    if (req.session.userId === null || req.session.userId === undefined) {
        res.send({
          auth: false,
        });
        return;
      };
    const client = req.client;
    try {
        const query = 'SELECT * FROM station';
        const result = await client.query(query);
  
        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
  });

  module.exports = router;