var express = require('express');
var router = express.Router();


router.get('/check-session', (req, res) => {
    console.log(req.session);
    console.log(req.session.userId);
    res.json({ isAuthenticated: !!req.session.userId });
  });

// Route to handle login
router.post('/login', (req, res) => {
    const client = req.client;
    const { id, password } = req.body;
    const query = 'SELECT * FROM admin WHERE id = $1 AND password = $2';
  
    client.query(query, [id, password], (error, results) => {
      if (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
      } else {
        if (results.rowCount === 1) {
          req.session.userId = id;
          res.json({ status: 'success' });
        } else {
          res.json({ status: 'fail' });
        }
      }
    });
  });

router.post('/logout', (req, res) => {
    req.session.userId = null;
    console.log("logout");
    req.session.destroy((error) => {
      if (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
      } else {
        res.clearCookie('connect.sid');
  
        res.json({ status: 'success' });
      }
    });
  });

module.exports = router;