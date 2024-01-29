var express = require('express');
var router = express.Router();


// Route to get bus data
router.get('/', (req, res) => {
    const client = req.client;
    const query = 'SELECT * FROM bus';
    
    client.query(query, (error, results) => {
      if (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
      } else {
        res.json(results.rows);
      }
    });
  });

// Route to add bus data
router.post('/add', (req, res) => {
  const client = req.client;
    console.log(req.body);
    client.query (
        "INSERT INTO bus(reg_id, type, capacity, remarks) values($1, $2, $3, $4)",
        [req.body.reg_id, req.body.type, req.body.capacity, req.body.remarks]
    ).then(qres => {
        console.log(qres);
        if (qres.rowCount === 1) res.send(true);
        else if (qres.rowCount === 0) res.send(false);
    }).catch(e => {
        console.error(e.stack);
        res.send(false);
    });
});

router.delete('/delete', async (req, res) => {
  const { id } = req.body; // Get the ID of the bus record to delete
  const client = req.client;
  console.log(req.body);

  try {
    // Construct the SQL query to delete the record
    const deleteQuery = 'DELETE FROM bus WHERE reg_id = $1';

    // Execute the query
    await client.query(deleteQuery, [id]);

    // Send a response indicating successful deletion
    res.json({ message: 'Bus deleted successfully' });
  } catch (error) {
    console.error('Error deleting bus:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


module.exports = router;
  