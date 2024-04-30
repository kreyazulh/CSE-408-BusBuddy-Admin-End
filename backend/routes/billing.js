var express = require('express');
var router = express.Router();

// GET endpoint to fetch buet_staff data
router.get('/buet_staff', async (req, res) => {
  if (req.session.userId === null || req.session.userId === undefined) {
    res.send({
      auth: false,
    });
    return;
  };
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
  if (req.session.userId === null || req.session.userId === undefined) {
    res.send({
      auth: false,
    });
    return;
  };
  try {
      const client = req.client;
    const result = await client.query('SELECT * FROM inventory');
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
});
  
  // Add to your server-side code
router.post('/startNewMonth', async (req, res) => {
  if (req.session.userId === null || req.session.userId === undefined) {
    res.send({
      auth: false,
    });
    return;
  };
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


router.get('/repairRequestsCount', async (req, res) => {
  if (req.session.userId === null || req.session.userId === undefined) {
    res.send({
      auth: false,
    });
    return;
  };
    try {
        const client = req.client;
        const result = await client.query('SELECT COUNT(*) FROM repair WHERE is_repaired = FALSE');
        res.json(result.rows[0].count); // Assuming you want the count of items not yet repaired
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
});


router.get('/repairRequests', async (req, res) => {
  if (req.session.userId === null || req.session.userId === undefined) {
    res.send({
      auth: false,
    });
    return;
  };
    try {
        const client = req.client;
        const result = await client.query('SELECT * FROM repair');
        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
});

// In your server-side route handlers
router.get('/requests/:request_id', async (req, res) => {
  if (req.session.userId === null || req.session.userId === undefined) {
    res.send({
      auth: false,
    });
    return;
  };
    try {
      const { request_id } = req.params;
      const client = req.client;
      const query = 'SELECT * FROM repair WHERE id = $1';
      const values = [request_id];
      const result = await client.query(query, values);
      if(result.rows.length > 0) {
        res.json(result.rows[0]);
      } else {
        res.status(404).json({ error: 'Request not found' });
      }
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
        }
    }
);

router.post('/requests/:request_id', async (req, res) => {
  if (req.session.userId === null || req.session.userId === undefined) {
    res.send({
      auth: false,
    });
    return;
  };
    const { request_id } = req.params; // Get request_id from URL
    const { is_repaired, parts } = req.body; // Extract is_repaired status and parts array from request body
    const client = req.client; // Assuming req.client is your PostgreSQL client

    try {
        await client.query('BEGIN'); // Start a transaction

        // Update the repair request to mark it as repaired
        const updateRepairQuery = 'UPDATE repair SET is_repaired = $1 WHERE id = $2';
        await client.query(updateRepairQuery, [is_repaired, request_id]);

        // Loop through each part and update inventory
        for (const partName of parts) {
            console.log('Updating inventory for part:', partName);
            const updateInventoryQuery = 'UPDATE inventory SET amount = amount - 1 WHERE id = $1 AND amount > 0';
            await client.query(updateInventoryQuery, [partName]);
        }

        await client.query('COMMIT'); // Commit the transaction if all operations succeed

        res.status(200).json({ message: 'Repair request approved and inventory updated.' });
    } catch (error) {
        await client.query('ROLLBACK'); // Rollback the transaction in case of any error
        console.error('Failed to approve request:', error);
        res.status(500).json({ error: 'Server error' });
    }
});


module.exports = router;