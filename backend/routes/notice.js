const express = require('express');
const router = express.Router();

// GET /notice
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
        "INSERT INTO notice(date, text) values($1, $2)",
        [req.body.date, req.body.text]

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