var express = require('express');
var router = express.Router();
const sharedConfig = require('../sharedId');
const bcrypt = require('bcrypt');


router.get('/check-session', (req, res) => {
    //console.log(req.session);
    console.log(req.session.userId);
    res.json({ isAuthenticated: !!req.session.userId });
  });

// Route to handle login

  router.post('/login', async (req, res) => {
    const client = req.client;
    // Extract login credentials from request body
    const { id, password } = req.body;

    try {
        // Fetch user from the database by phone
        const queryResult = await client.query(
            "SELECT * FROM admin WHERE id = $1",
            [id]
        );

        if (queryResult.rowCount === 0) {
            // If no user is found, send an error response
            return res.status(404).send({ success: false, message: "Admin not found." });
        }

        // User found, extract the stored hashed password
        const admin = queryResult.rows[0];
        const hashedPassword = admin.password;

        // Compare the provided password with the stored hashed password
        const isMatch = await bcrypt.compare(password, hashedPassword);

        if (isMatch) {
            // Passwords match, login successful
            req.session.userId = id;
            sharedConfig.userId = id;
            console.log(req.session);
            res.send({ status: "success", message: "Login successful." });
            // Proceed to create session/token or any post-login process
        } else {
            // Passwords do not match, login failed
            res.status(401).send({ status: "fail", message: "Incorrect password." });
        }
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).send({ status: "fail", message: "Error processing login request." });
    }
});


// usage : navbar
router.post('/logout', (req, res) => {
  if (req.session.userId === null || req.session.userId === undefined) {
    res.send({
      auth: false,
    });
    return;
  };
  req.session.userId = null;
  sharedConfig.userId = null;
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