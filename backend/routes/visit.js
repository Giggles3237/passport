import express from 'express';
import pool from '../db/index.js';
import { v4 as uuidv4 } from 'uuid';

const router = express.Router();

// Track a visit to a location
router.post('/', async (req, res) => {
  const { location_id, session_id, user_id } = req.body;
  
  if (!location_id) {
    return res.status(400).json({ error: 'Missing location_id' });
  }

  try {
    // Get client IP address
    const ip_address = req.ip || req.connection.remoteAddress || req.headers['x-forwarded-for'] || 'unknown';
    
    // Get user agent
    const user_agent = req.headers['user-agent'] || 'unknown';
    
    // Generate session ID if not provided
    const finalSessionId = session_id || uuidv4();
    
    // Insert visit record
    const [result] = await pool.query(
      'INSERT INTO visits (location_id, session_id, user_id, ip_address, user_agent) VALUES (?, ?, ?, ?, ?)',
      [location_id, finalSessionId, user_id || null, ip_address, user_agent]
    );
    
    res.json({ 
      success: true, 
      visit_id: result.insertId,
      session_id: finalSessionId 
    });
  } catch (err) {
    console.error('Error tracking visit:', err);
    res.status(500).json({ error: 'Database error' });
  }
});

// Get visit statistics for a location
router.get('/stats/:location_id', async (req, res) => {
  const { location_id } = req.params;
  
  try {
    // Get total visits for this location
    const [[{ total_visits }]] = await pool.query(
      'SELECT COUNT(*) as total_visits FROM visits WHERE location_id = ?',
      [location_id]
    );
    
    // Get unique visitors (by session_id)
    const [[{ unique_visitors }]] = await pool.query(
      'SELECT COUNT(DISTINCT session_id) as unique_visitors FROM visits WHERE location_id = ?',
      [location_id]
    );
    
    // Get registered users who visited
    const [[{ registered_visitors }]] = await pool.query(
      'SELECT COUNT(DISTINCT user_id) as registered_visitors FROM visits WHERE location_id = ? AND user_id IS NOT NULL',
      [location_id]
    );
    
    // Get visits per day for the last 30 days
    const [visitsPerDay] = await pool.query(`
      SELECT DATE(timestamp) as date, COUNT(*) as count
      FROM visits 
      WHERE location_id = ? AND timestamp >= DATE_SUB(NOW(), INTERVAL 30 DAY)
      GROUP BY DATE(timestamp)
      ORDER BY date DESC
    `, [location_id]);
    
    res.json({
      location_id,
      total_visits,
      unique_visitors,
      registered_visitors,
      visits_per_day: visitsPerDay
    });
  } catch (err) {
    console.error('Error getting visit stats:', err);
    res.status(500).json({ error: 'Database error' });
  }
});

// Get all visits for a user (if registered)
router.get('/user/:user_id', async (req, res) => {
  const { user_id } = req.params;
  
  try {
    const [visits] = await pool.query(`
      SELECT v.*, l.name as location_name, l.store_id
      FROM visits v
      JOIN locations l ON v.location_id = l.id
      WHERE v.user_id = ?
      ORDER BY v.timestamp DESC
    `, [user_id]);
    
    res.json({ visits });
  } catch (err) {
    console.error('Error getting user visits:', err);
    res.status(500).json({ error: 'Database error' });
  }
});

export default router; 