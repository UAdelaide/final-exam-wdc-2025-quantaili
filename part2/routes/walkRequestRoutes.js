const express = require('express');
const router = express.Router();
const db = require('../models/db');

// GET all open walk requests with detailed info
router.get('/open', async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT wr.*, d.name AS dog_name, d.size, u.username AS owner_username, 
             d.breed, wr.requested_time, wr.duration_minutes, wr.location
      FROM WalkRequests wr
      JOIN Dogs d ON wr.dog_id = d.dog_id
      JOIN Users u ON d.owner_id = u.user_id
      WHERE wr.status = 'open'
    `);
    res.json(rows);
  } catch (error) {
    console.error('SQL Error:', error);
    res.status(500).json({ error: 'Failed to fetch open walk requests' });
  }
});

// GET walk requests by owner ID
router.get('/owner/:ownerId', async (req, res) => {
  try {
    const ownerId = req.params.ownerId;
    
    const [rows] = await db.query(`
      SELECT wr.*, d.name AS dog_name, d.size, d.breed,
             wr.requested_time, wr.duration_minutes, wr.location, wr.status
      FROM WalkRequests wr
      JOIN Dogs d ON wr.dog_id = d.dog_id
      WHERE d.owner_id = ?
      ORDER BY wr.requested_time DESC
    `, [ownerId]);
    
    res.json(rows);
  } catch (error) {
    console.error('SQL Error:', error);
    res.status(500).json({ error: 'Failed to fetch owner\'s walk requests' });
  }
});

module.exports = router;
