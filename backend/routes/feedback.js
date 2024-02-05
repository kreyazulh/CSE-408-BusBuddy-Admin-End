var express = require('express');
var router = express.Router();
const bcrypt = require('bcrypt');

const saltRounds = 10;


router.get('/student', (req, res) => {
    const client = req.client;
    const query = 'SELECT * FROM student_feedback';
    
    client.query(query, (error, results) => {
      if (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
      } else {
        res.json(results.rows);
      }
    });
  });

  router.get('/student/:feedbackId', (req, res) => {
    const client = req.client;
    const { feedbackId } = req.params;
    const query = 'SELECT * FROM student_feedback WHERE id = $1';
    
    client.query(query, [feedbackId], (error, results) => {
      if (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
      } else {
        res.json(results.rows);
      }
    });
  });

  router.put('/student/respond', (req, res) => {
    const client = req.client;
      console.log(req.body);
      client.query (
          "UPDATE student_feedback SET response = $2 WHERE id=$1;",
          [req.body.id, req.body.response]
      ).then(qres => {
          console.log(qres);
          if (qres.rowCount === 1) res.send(true);
          else if (qres.rowCount === 0) res.send(false);
      }).catch(e => {
          console.error(e.stack);
          res.send(false);
      });
  });

  router.get('/teacher', (req, res) => {
    const client = req.client;
    const query = 'SELECT * FROM buet_staff_feedback';
    
    client.query(query, (error, results) => {
      if (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
      } else {
        res.json(results.rows);
      }
    });
  });

  router.get('/teacher/:feedbackId', (req, res) => {
    const client = req.client;
    const { feedbackId } = req.params;
    const query = 'SELECT * FROM buet_staff_feedback WHERE id = $1';
    
    client.query(query, [feedbackId], (error, results) => {
      if (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
      } else {
        res.json(results.rows);
      }
    });
  });

  router.put('/teacher/respond', (req, res) => {
    const client = req.client;
      console.log(req.body);
      client.query (
          "UPDATE buet_staff_feedback SET response = $2 WHERE id=$1;",
          [req.body.id, req.body.response]
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