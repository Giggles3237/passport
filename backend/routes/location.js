import express from 'express';
import pool from '../db/index.js';

const router = express.Router();

// Map neighborhood slugs to location IDs
const LOCATION_MAP = {
  'lawrenceville': 1,
  'strip_district': 2,
  'downtown': 3,
  'bloomfield': 4,
  'shadyside': 5
};

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

// Get location by slug (neighborhood name)
router.get('/slug/:slug', async (req, res) => {
  const { slug } = req.params;
  const location_id = LOCATION_MAP[slug];
  
  if (!location_id) {
    return res.status(404).json({ error: 'Location not found' });
  }
  
  try {
    const [rows] = await pool.query('SELECT * FROM locations WHERE id = ?', [location_id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Location not found' });
    }
    res.json({ ...rows[0], slug });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

export default router; 