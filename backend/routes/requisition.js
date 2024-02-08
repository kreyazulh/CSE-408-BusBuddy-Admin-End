var express = require('express');
var router = express.Router();
const bcrypt = require('bcrypt');

const saltRounds = 10;


router.get('/', (req, res) => {
    const client = req.client;
    const query = 'SELECT * FROM requisition';
    
    client.query(query, (error, results) => {
      if (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
      } else {
        res.json(results.rows);
      }
    });
  });

  router.get('/:reqId', (req, res) => {
    const client = req.client;
    const { feedbackId } = req.params;
    const query = 'SELECT * FROM requisition WHERE id = $1';
    
    client.query(query, [feedbackId], (error, results) => {
      if (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
      } else {
        res.json(results.rows);
      }
    });
  });


module.exports = router;