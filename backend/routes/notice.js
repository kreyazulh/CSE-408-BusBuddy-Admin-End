const express = require('express');
const router = express.Router();

// GET /notice
router.get('/', (req, res) => {
  if (req.session.userId === null || req.session.userId === undefined) {
    res.send({
      auth: false,
    });
    return;
  };
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
  if (req.session.userId === null || req.session.userId === undefined) {
    res.send({
      auth: false,
    });
    return;
  };
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

router.post('/delete/:id', (req, res) => {
  if (req.session.userId === null || req.session.userId === undefined) {
    res.send({
      auth: false,
    });
    return;
  };
  const client = req.client;
  const noticeId = req.params.id; // Get the ID from the request parameters

  client.query(
    "DELETE FROM notice WHERE id = $1", 
    [noticeId]
  ).then(qres => {
    console.log(qres);
    if (qres.rowCount === 1) {
      // If one row was affected, the deletion was successful
      res.status(200).json({ success: true, message: "Notice deleted successfully." });
    } else {
      // If no rows were affected, the notice with the given ID doesn't exist
      res.status(404).json({ success: false, message: "Notice not found." });
    }
  }).catch(e => {
    console.error(e.stack);
    res.status(500).json({ success: false, message: "An error occurred during deletion." });
  });
});

router.post('/update/:id', (req, res) => {
  if (req.session.userId === null || req.session.userId === undefined) {
    res.send({
      auth: false,
    });
    return;
  };
  const client = req.client;
  const noticeId = req.params.id; // Get the ID of the notice to be updated from the URL
  const { text } = req.body; // Get the updated text from the request body

  client.query(
    "UPDATE notice SET text = $1 WHERE id = $2",
    [text, noticeId]
  ).then(qres => {
    console.log(qres);
    if (qres.rowCount === 1) {
      res.status(200).json({ success: true, message: "Notice updated successfully." });
    } else {
      res.status(404).json({ success: false, message: "Notice not found." });
    }
  }).catch(e => {
    console.error(e.stack);
    res.status(500).json({ success: false, message: "An error occurred during the update." });
  });
});



module.exports = router;