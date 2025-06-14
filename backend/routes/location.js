import express from 'express';
import pool from '../db/index.js';

const router = express.Router();

router.get('/:id', async (req, res) => {
  const location_id = req.params.id;
  try {
    const [rows] = await pool.query('SELECT * FROM locations WHERE id = ?', [location_id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Location not found' });
    }
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

export default router; 