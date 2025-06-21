const express = require('express');
const router = express.Router();
const db = require('../models/db');

// GET all dogs with size and owner username
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT d.*, d.size, u.username AS owner_username
      FROM Dogs d
      JOIN Users u ON d.owner_id = u.user_id
    `);
    res.json(rows);
  } catch (error) {
    console.error('SQL Error:', error);
    res.status(500).json({ error: 'Failed to fetch dogs' });
  }
});

// GET dogs by owner ID
router.get('/owner/:ownerId', async (req, res) => {
  try {
    const ownerId = req.params.ownerId;
    
    const [rows] = await db.query(`
      SELECT d.*
      FROM Dogs d
      WHERE d.owner_id = ?
    `, [ownerId]);
    
    res.json(rows);
  } catch (error) {
    console.error('SQL Error:', error);
    res.status(500).json({ error: 'Failed to fetch owner\'s dogs' });
  }
});

module.exports = router;
