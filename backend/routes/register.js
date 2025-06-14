import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import pool from '../db/index.js';

const router = express.Router();

router.post('/', async (req, res) => {
  const { name, email, store_id } = req.body;
  const finalStoreId = store_id || 1;
  if (!name || !email) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  const user_id = uuidv4();
  try {
    await pool.query(
      'INSERT INTO users (id, name, email, store_id) VALUES (?, ?, ?, ?)',
      [user_id, name, email, finalStoreId]
    );
    res.cookie('user_id', user_id, { httpOnly: false, sameSite: 'lax' });
    res.json({ user_id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

export default router; 