var express = require('express');
var router = express.Router();

// GET endpoint to fetch buet_staff data
router.get('/buet_staff', async (req, res) => {
    try {
        const client = req.client;
      const result = await client.query('SELECT * FROM buet_staff');
      res.json(result.rows);
    } catch (error) {
      console.error(error);
      res.status(500).send('Server error');
    }
  });


router.get('/inventory', async (req, res) => {
  try {
      const client = req.client;
    const result = await client.query('SELECT * FROM inventory');
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
});
  

module.exports = router;