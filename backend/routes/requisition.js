var express = require('express');
var router = express.Router();
const bcrypt = require('bcrypt');

const saltRounds = 10;


router.get('/', (req, res) => {
  if (req.session.userId === null || req.session.userId === undefined) {
    res.send({
      auth: false,
    });
    return;
  };
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
    if (req.session.userId === null || req.session.userId === undefined) {
      res.send({
        auth: false,
      });
      return;
    };
    const client = req.client;
    const { reqId } = req.params;
    const query = 'SELECT * FROM requisition WHERE id = $1';
    
    client.query(query, [reqId], (error, results) => {
      if (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
      } else {
        res.json(results.rows);
      }
    });
  });

  router.put('/approve', (req, res) => {
    if (req.session.userId === null || req.session.userId === undefined) {
      res.send({
        auth: false,
      });
      return;
    };
    const client = req.client;
      console.log(req.body);
      client.query (
          "CALL alloc_from_req($1,$2,$3,$4,$5,$6,$7,$8,$9);",
          [req.body.id, req.body.time, req.body.approver, req.body.bus_id, req.body.driver, req.body.collector, req.body.remarks, req.body.payment, req.body.req_id]
      ).then(qres => {
          console.log(qres);
          if (qres.rowCount === 1) res.send(true);
          else if (qres.rowCount === 0) res.send(false);
      }).catch(e => {
          console.error(e.stack);
          res.send(false);
      });
  });

  router.put('/reject', (req, res) => {
    if (req.session.userId === null || req.session.userId === undefined) {
      res.send({
        auth: false,
      });
      return;
    };
    const client = req.client;
      console.log(req.body);
      client.query (
          "UPDATE requisition SET approved_by = $2, remarks = $3, is_approved=false WHERE id = $1;",
          [req.body.id, req.body.approver, req.body.remarks]
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