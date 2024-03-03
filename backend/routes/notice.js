const express = require('express');
const router = express.Router();

// Get all notices
// router.get('/', (req, res) => {
//   const client = req.client; // Assuming you have a middleware to set up the client
//   const query = 'SELECT * FROM notice';

//   client.query(query, (error, results) => {
//     if (error) {
//       console.error(error);
//       return res.status(500).json({ error: 'Internal Server Error' });
//     }
//     res.json(results.rows);
//     console.log(results.rows);
//   });
// });

// // Post a notice
// router.post('/', (req, res) => {
//   const client = req.client;
//   const { date, title, body } = req.body; // Ensure you validate and sanitize input
//   const query = 'INSERT INTO notice (date, title, body) VALUES ($1, $2, $3) RETURNING *';

//   client.query(query, [date, title, body], (error, results) => {
//     if (error) {
//       console.error(error);
//       return res.status(500).json({ error: 'Internal Server Error' });
//     }
//     res.status(201).json(results.rows[0]);
//   });
// });

// // Delete a notice
// router.delete('/:id', (req, res) => {
//   const client = req.client;
//   const { id } = req.params;
//   const query = 'DELETE FROM notice WHERE id = $1 RETURNING *';

//   client.query(query, [id], (error, results) => {
//     if (error) {
//       console.error(error);
//       return res.status(500).json({ error: 'Internal Server Error' });
//     }
//     if (results.rows.length === 0) {
//       return res.status(404).json({ error: 'Notice not found' });
//     }
//     res.json({ message: 'Notice deleted', notice: results.rows[0] });
//   });
// });

// // Update a notice
// router.put('/:id', (req, res) => {
//   const client = req.client;
//   const { id } = req.params;
//   const { date, title, body } = req.body; // Ensure you validate and sanitize input
//   const query = 'UPDATE notice SET date = $2, title = $3, body = $4 WHERE id = $1 RETURNING *';

//   client.query(query, [id, date, title, body], (error, results) => {
//     if (error) {
//       console.error(error);
//       return res.status(500).json({ error: 'Internal Server Error' });
//     }
//     if (results.rows.length === 0) {
//       return res.status(404).json({ error: 'Notice not found' });
//     }
//     res.json(results.rows[0]);
//   });
// });

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

router.post('/add', (req, res) => {
  const client = req.client;
    console.log(req.body);
    client.query (
        "INSERT INTO notice(text) values($1)",
        [req.body.text]

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