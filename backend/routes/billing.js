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
  
  // Add to your server-side code
router.post('/startNewMonth', async (req, res) => {
    try {
        const client = req.client; // Ensure you have a client from your db connection pool
        const updateResult = await client.query(
            "UPDATE buet_staff SET pending = pending + 200 WHERE service = TRUE"
        );
        res.json({ message: "Pending values updated for the new month." });
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
});

module.exports = router;