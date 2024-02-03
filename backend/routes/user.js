var express = require('express');
var router = express.Router();
const bcrypt = require('bcrypt');

const saltRounds = 10;


router.post('/student/add', async (req, res) => {
    const client = req.client;
    console.log(req.body);

    const { id, phone, email, default_route, password, name, default_station } = req.body;

    try {
        // Generate a salt and hash on separate function calls
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        console.log(hashedPassword);

        client.query(
            "INSERT INTO student(id, phone, email, default_route, password, name, default_station) VALUES($1, $2, $3, $4, $5, $6, $7)",
            [id, phone, email, default_route, hashedPassword, name, default_station]
        ).then(qres => {
            console.log(qres);
            if (qres.rowCount === 1) {
                res.send({ success: true, message: "User added successfully." });
            } else {
                res.send({ success: false, message: "No user was added." });
            }
        }).catch(e => {
            console.error(e.stack);
            res.status(500).send({ success: false, message: "Error adding user." });
        });
    } catch (error) {
        console.error('Error hashing password:', error);
        res.status(500).send({ success: false, message: "Error processing request." });
    }
});






module.exports = router;