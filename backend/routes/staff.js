var express = require('express');
var router = express.Router();

// Route to get bus staff data
// usage : busStaffList
router.get('/', (req, res) => {
    const client = req.client;
    const query = 'SELECT * FROM bus_staff';
    
    client.query(query, (error, results) => {
      if (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
      } else {
        res.json(results.rows);
      }
    });
  });

  router.get('/unavailableStaff', (req, res) => {
    const client = req.client;
    console.log("here");
    
    // Query to select staff with non-null start_date and end_date
    const query = 'SELECT id, name, start_date, end_date FROM bus_staff WHERE start_date IS NOT NULL AND end_date IS NOT NULL';
  
    client.query(query, (error, results) => {
      if (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
      } else {
        console.log("ran");
        // Send the results back to the client
        res.json(results.rows);
        console.log(results.rows);
      }
    });
  });

// usage : scheduleTrip
  router.get('/driver', (req, res) => {
    const client = req.client;
    const query = 'SELECT * FROM bus_staff WHERE role=$1';
    
    client.query(query,['driver'],(error, results) => {
      if (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
      } else {
        res.json(results.rows);
      }
    });
  });

  // usage : scheduleTrip
  router.get('/collector', (req, res) => {
    const client = req.client;
    const query = 'SELECT * FROM bus_staff WHERE role=$1';
    
    client.query(query,['collector'],(error, results) => {
      if (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
      } else {
        res.json(results.rows);
      }
    });
  });



  // Backend modification for drivers
router.get('/driver_with_time', (req, res) => {
  const client = req.client;
  const { time } = req.query; // Assuming 'time' is passed as a query parameter in the GET request
  console.log(time);
  const query = `
    SELECT * FROM bus_staff 
    WHERE role=$1 
    AND (start_date IS NULL OR end_date IS NULL OR $2::timestamp NOT BETWEEN start_date AND end_date)
  `;
  
  client.query(query, ['driver', time], (error, results) => {
    if (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      res.json(results.rows);
      console.log(results.rows);
    }
  });
});

// Backend modification for collectors
router.get('/collector_with_time', (req, res) => {
  const client = req.client;
  const { time } = req.query; // Assuming 'time' is passed as a query parameter in the GET request
  const query = `
    SELECT * FROM bus_staff 
    WHERE role=$1 
    AND (start_date IS NULL OR end_date IS NULL OR $2::timestamp NOT BETWEEN start_date AND end_date)
  `;
  
  client.query(query, ['collector', time], (error, results) => {
    if (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      res.json(results.rows);
      console.log(results.rows);
    }
  });
});


// usage : staffProfile
  router.get('/:staffId', (req, res) => {
    const client = req.client;
    const { staffId } = req.params;
    const query = 'SELECT * FROM bus_staff WHERE id = $1';
    
    client.query(query, [staffId], (error, results) => {
      if (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
      } else {
        res.json(results.rows);
      }
    });
  });

  // usage : addStaff
router.post('/add', (req, res) => {
    const client = req.client;
    console.log(req.body);
    client.query (
        "INSERT INTO bus_staff(id, phone, password, role, name) values($1, $2, $3, $4, $5)",
        [req.body.id, req.body.phone, req.body.password, req.body.role, req.body.name]
    ).then(qres => {
        console.log(qres);
        if (qres.rowCount === 1) res.send(true);
        else if (qres.rowCount === 0) res.send(false);
    }).catch(e => {
        console.error(e.stack);
        res.send(false);
    });
});

// usage : busStaffList
router.delete('/delete', async (req, res) => {
  const { id } = req.body;
  const client = req.client;

  try {
    const deleteQuery = 'DELETE FROM bus_staff WHERE id = $1';
    await client.query(deleteQuery, [id]);
    res.json({ message: 'Staff deleted successfully' });
  } catch (error) {
    console.error('Error deleting staff:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.post('/unavailability', (req, res) => {
  const client = req.client;
  const { staffId, startDate, endDate } = req.body;

  // Assuming there's a column in your table to store unavailability start and end dates.
  // You might need to adjust the table and column names based on your schema.
  const query = `
    UPDATE bus_staff
    SET start_date = $1, end_date = $2
    WHERE id = $3
  `;

  client.query(query, [startDate, endDate, staffId], (error, results) => {
    if (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      // Assuming you want to return the updated row; adjust as necessary.
      if (results.rowCount === 0) {
        // No rows were updated, which means the staff ID was not found.
        res.status(404).json({ error: 'Staff not found' });
      } else {
        res.json({ message: 'Staff unavailability updated successfully' });
      }
    }
  });
});


module.exports = router;
