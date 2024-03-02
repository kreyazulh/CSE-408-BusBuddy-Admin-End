var express = require('express');
var router = express.Router();
const sharedConfig = require('.././sharedId');


// Route to get admin data
// usage : ~
router.get('/', (req, res) => {
  const client = req.client;
  const query = 'SELECT * FROM admin';
  
  client.query(query, (error, results) => {
    if (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      res.json(results.rows);
    }
  });
});


// usage : adminProfile::fetchAdminDetails(), 
router.get('/profile', async (req, res) => {
  const client = req.client;
  var id = sharedConfig.userId;
  console.log(id);
  const query = 'SELECT * FROM admin WHERE id = $1';

  try {
    const results = await client.query(query, [id]);

    if (results.rows.length > 0) {
      // If the admin profile was found, send it back as the response
      res.json(results.rows[0]);
    } else {
      // No profile was found for the given ID
      res.status(404).json({ error: 'Profile not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// usage : adminProfile::lastTrips()
router.get('/trips/last7days', async (req, res) => {
  const client = req.client;
  try {
    const result = await client.query(`
      SELECT 
        DATE(start_timestamp) as trip_date, 
        COUNT(*) as trip_count
      FROM 
        trip
      WHERE 
        start_timestamp >= current_date - interval '7 days'
      GROUP BY 
        DATE(start_timestamp)
      ORDER BY 
        DATE(start_timestamp);
    `);

    // Send the result back to the client
    res.json(result.rows);
    console.log(result.rows);
  } catch (error) {
    console.error('Error fetching trip counts:', error);
    res.status(500).send({ success: false, message: "Error processing request." });
  }
});

// usage : adminProfile::fetchTopPassengerCounts(), 
router.get('/trips/topYesterday', async (req, res) => {
  const client = req.client;
  try {
    const result = await client.query(`
      SELECT 
        r.terminal_point, 
        t.time_type, 
        t.passenger_count,
        b.capacity
      FROM 
        trip t
      INNER JOIN 
        route r ON t.route = r.id
      INNER JOIN 
        bus b ON t.bus = b.reg_id
      WHERE 
        t.start_timestamp >= current_date - interval '1 day' AND
        t.start_timestamp < current_date
      ORDER BY 
        t.passenger_count DESC;
    `);

    // Send the result back to the client
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching top trips:', error);
    res.status(500).send({ success: false, message: "Error processing request." });
  }
});


// usage : adminProfile::fetchUserCounts()
router.get('/counts', async (req, res) => {
  const client = req.client;

  try {
    // Query to count students
    const studentsResult = await client.query('SELECT COUNT(*) AS student_count FROM student;');
    const studentCount = studentsResult.rows[0].student_count;
    console.log(studentCount);

    // Query to count bus staff
    const busStaffResult = await client.query('SELECT COUNT(*) AS bus_staff_count FROM bus_staff;');
    const busStaffCount = busStaffResult.rows[0].bus_staff_count;
    console.log(busStaffCount);

    // Query to count BUET staff
    const buetStaffResult = await client.query('SELECT COUNT(*) AS buet_staff_count FROM buet_staff;');
    const buetStaffCount = buetStaffResult.rows[0].buet_staff_count;
    console.log(buetStaffCount);

    // Send the counts back to the client
    res.json({
      studentCount: studentCount,
      busStaffCount: busStaffCount,
      buetStaffCount: buetStaffCount
    });
  } catch (error) {
    console.error('Error fetching counts:', error);
    res.status(500).send({ success: false, message: "Error processing request." });
  }
});

// usage : adminProfile::fetchTicketCounts()
router.get('/tickets', async (req, res) => {
  const client = req.client;

  try {
    // Query to count tickets
    const ticketResult = await client.query('SELECT COUNT(*) AS ticket_count FROM ticket;');
    const ticketCount = ticketResult.rows[0].ticket_count;

    // Send the counts back to the client
    res.json({
      ticketCount: ticketCount,
    });
  } catch (error) {
    console.error('Error fetching counts:', error);
    res.status(500).send({ success: false, message: "Error processing request." });
  }
});

// usage : adminProfile::fetchTripStats()
router.get('/trips/stats', async (req, res) => {
  const client = req.client;

  try {
    // Query to count live trips
    const liveTripsResult = await client.query(`
      SELECT COUNT(*) AS live_trips_count
      FROM trip
      WHERE is_live = true;
    `);
    const liveTripsCount = parseInt(liveTripsResult.rows[0].live_trips_count, 10);

    // Query to count upcoming trips
    const upcomingTripsResult = await client.query(`
      SELECT COUNT(*) AS upcoming_trips_count
      FROM allocation
      WHERE start_timestamp > NOW();
    `);
    const upcomingTripsCount = parseInt(upcomingTripsResult.rows[0].upcoming_trips_count, 10);
    console.log(liveTripsCount);
    console.log(upcomingTripsCount);

    // Send the counts back to the client
    res.json({
      liveTripsCount: liveTripsCount,
      upcomingTripsCount: upcomingTripsCount
    });
  } catch (error) {
    console.error('Error fetching trip stats:', error);
    res.status(500).send({ success: false, message: "Error processing request." });
  }
});

module.exports = router;