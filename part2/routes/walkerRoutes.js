const express = require('express');
const router = express.Router();
const db = require('../models/db');

// GET summary of each walker's ratings and completed walks
router.get('/summary', async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT 
        u.user_id,
        u.username,
        COUNT(wr.rating) AS total_ratings,
        IFNULL(AVG(wr.rating), 0) AS average_rating,
        COUNT(wa.application_id) AS completed_walks
      FROM 
        Users u
      LEFT JOIN 
        WalkApplications wa ON u.user_id = wa.walker_id
      LEFT JOIN 
        WalkRequests w ON wa.request_id = w.request_id
      LEFT JOIN 
        WalkRatings wr ON wa.application_id = wr.application_id
      WHERE 
        u.role = 'walker'
      GROUP BY 
        u.user_id, u.username
    `);
    res.json(rows);
  } catch (error) {
    console.error('SQL Error:', error);
    res.status(500).json({ error: 'Failed to fetch walker summaries' });
  }
});

module.exports = router;
