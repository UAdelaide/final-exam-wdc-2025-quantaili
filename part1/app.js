const express = require ('express');
const app = express();
const mysql = require('mysql2/promise');
const port = 8080;

const dbConfig = {
    host: '127.0.0.1',
    user: 'root',
    password: '',
    database: 'DogWalkService'
};

let pool;
(async () => {
    try{
        pool = await mysql.createPool(dbConfig);
        console.log('MySQL pool created');

        app.listen(port, () => {
            console.log(`Server running at http://localhost:${port}`);
        });
    } catch (error) {
        console.error('Failed to initialze server:', err.message);
    }
})();

// 1. /api/dogs
app.get('/api/dogs', async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT d.name AS dog_name, d.size, u.username AS owner_username
      FROM Dogs d
      JOIN Users u ON d.owner_id = u.user_id
    `);
    res.json(rows);
  } catch (error) {
    console.error('Error fetching dogs:', error);
    res.status(500).json({ error: 'Failed to fetch dogs' });
  }
});

// 2. /api/walkrequests/open
app.get('/api/walkrequests/open', async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT 
        wr.request_id, 
        d.name AS dog_name, 
        wr.requested_time, 
        wr.duration_minutes,
        wr.location, 
        u.username AS owner_username
      FROM WalkRequests wr
      JOIN Dogs d ON wr.dog_id = d.dog_id
      JOIN Users u ON d.owner_id = u.user_id
      WHERE wr.status = 'open'
    `);
    res.json(rows);
  } catch (error) {
    console.error('Error fetching open walk requests:', error);
    res.status(500).json({ error: 'Failed to fetch open walk requests' });
  }
});

// 3. /api/walkers/summary
pp.get('/api/walkers/summary', async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT 
        u.username AS walker_username,
        COUNT(wr.rating_id) AS total_ratings,
        AVG(wr.rating) AS average_rating,
        COUNT(DISTINCT wa.request_id) AS completed_walks
      FROM Users u
      LEFT JOIN WalkApplications wa ON u.user_id = wa.walker_id AND wa.status = 'accepted'
      LEFT JOIN WalkRatings wr ON wa.request_id = wr.request_id AND u.user_id = wr.walker_id
      WHERE u.role = 'walker'
      GROUP BY u.user_id
    `);
    
    // Format the response
    const formattedRows = rows.map(row => ({
      walker_username: row.walker_username,
      total_ratings: row.total_ratings || 0,
      average_rating: row.average_rating || null,
      completed_walks: row.completed_walks || 0
    }));
    
    res.json(formattedRows);
  } catch (error) {
    console.error('Error fetching walker summary:', error);
    res.status(500).json({ error: 'Failed to fetch walker summary' });
  }
});
a