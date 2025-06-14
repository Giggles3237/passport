import express from 'express';
import pool from '../db/index.js';

const router = express.Router();

// GET /api/admin/stats
router.get('/stats', async (req, res) => {
  try {
    // Total users
    const [[{ user_count }]] = await pool.query('SELECT COUNT(*) as user_count FROM users');
    // Total stamps
    const [[{ stamp_count }]] = await pool.query('SELECT COUNT(*) as stamp_count FROM stamps');
    // Total locations
    const [[{ location_count }]] = await pool.query('SELECT COUNT(*) as location_count FROM locations');
    // Stamps per location
    const [stampsPerLocation] = await pool.query(`
      SELECT l.id, l.name, COUNT(s.id) as stamp_count
      FROM locations l
      LEFT JOIN stamps s ON l.id = s.location_id
      GROUP BY l.id, l.name
      ORDER BY l.id
    `);
    // Users per registration date
    const [usersPerDate] = await pool.query(`
      SELECT DATE(created_at) as date, COUNT(*) as count
      FROM users
      GROUP BY DATE(created_at)
      ORDER BY date DESC
    `);
    res.json({
      user_count,
      stamp_count,
      location_count,
      stamps_per_location: stampsPerLocation,
      users_per_date: usersPerDate
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

// GET /api/admin/registrants
router.get('/registrants', async (req, res) => {
  try {
    const [users] = await pool.query('SELECT id, name, email, created_at, store_id FROM users ORDER BY created_at DESC');
    res.json({ users });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

export default router; 