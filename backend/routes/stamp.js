import express from 'express';
import pool from '../db/index.js';

const router = express.Router();

router.post('/', async (req, res) => {
  const { user_id, location_id } = req.body;
  if (!user_id || !location_id) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  try {
    await pool.query(
      'INSERT INTO stamps (user_id, location_id) VALUES (?, ?)',
      [user_id, location_id]
    );
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

export default router; 