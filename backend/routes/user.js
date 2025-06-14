import express from 'express';
import pool from '../db/index.js';

const router = express.Router();

router.get('/:id', async (req, res) => {
  const user_id = req.params.id;
  try {
    const [userRows] = await pool.query('SELECT * FROM users WHERE id = ?', [user_id]);
    if (userRows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    const user = userRows[0];
    const [stampRows] = await pool.query(
      'SELECT s.id, s.location_id, s.timestamp, l.name as location_name FROM stamps s JOIN locations l ON s.location_id = l.id WHERE s.user_id = ?',
      [user_id]
    );
    res.json({ user, stamps: stampRows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

export default router; 