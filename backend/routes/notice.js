var express = require('express');
var router = express.Router();

// Route to get notice data
// usage : noticeList
router.get('/', (req, res) => {
    const client = req.client;
    const query = 'SELECT * FROM notice';
    
    client.query(query, (error, results) => {
      if (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
      } else {
        res.json(results.rows);
      }
    });
  });

// Route to add notice data
// usage : noticeAdd
router.post('/add', (req, res) => {
  const client = req.client;
    console.log(req.body);
    client.query (
        "INSERT INTO notice(ID, time_stamp, body) values($1, $2, $3)",
        [req.body.id, req.body.time, req.body.description]
    ).then(qres => {
        console.log(qres);
        if (qres.rowCount === 1) res.send(true);
        else if (qres.rowCount === 0) res.send(false);
    }).catch(e => {
        console.error(e.stack);
        res.send(false);
    });
});

//Route to delete notice data
// usage : noticeList
router.delete('/delete', async (req, res) => {
  const { id } = req.body; // Get the ID of the notice record to delete
  const client = req.client;
  console.log(req.body);

  try {
    // Construct the SQL query to delete the record
    const deleteQuery = 'DELETE FROM notice WHERE id = $1';

    // Execute the query
    await client.query(deleteQuery, [id]);

    // Send a response indicating successful deletion
    res.json({ message: 'Notice deleted successfully' });
  } catch (error) {
    console.error('Error deleting notice:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

//Route to save notice data
// usage : noticeList
router.post('/save', (req, res) => {
  const client = req.client;
  const { ID, body } = req.body;
  console.log(req.body);
  const query = "UPDATE notice SET body = $3 WHERE ID=$1;";

  client.query(query, [ID, body], (error, results) => {
    if (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      res.json({ message: 'Notice added successfully' });
    }
  });
});



//Route to details of a notice
// usage : noticeList
router.get('/:id', (req, res) => {
  const client = req.client;
  const { id } = req.params;
  const query = 'SELECT * FROM notice WHERE id = $1';
  
  client.query(query, [id], (error, results) => {
    if (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      res.json(results.rows);
    }
  });
});

//Route to update notice data
// usage : noticeList
router.put('/update', (req, res) => {
  const client = req.client;
    console.log(req.body);
    client.query (
        "UPDATE notice SET time_stamp = $2, body = $3 WHERE id=$1;",
        [req.body.id, req.body.time, req.body.description]
    ).then(qres => {
        console.log(qres);
        if (qres.rowCount === 1) res.send(true);
        else if (qres.rowCount === 0) res.send(false);
    }).catch(e => {
        console.error(e.stack);
        res.send(false);
    });
});

module.exports = router;
