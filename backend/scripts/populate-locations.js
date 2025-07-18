import pool from '../db/index.js';

const LOCATIONS = [
  { id: 1, name: 'Lawrenceville', store_id: 1 },
  { id: 2, name: 'Strip District', store_id: 1 },
  { id: 3, name: 'Downtown', store_id: 1 },
  { id: 4, name: 'Bloomfield', store_id: 1 },
  { id: 5, name: 'Shadyside', store_id: 1 }
];

async function populateLocations() {
  try {
    console.log('Populating locations table...');
    
    // First, ensure we have a store
    await pool.query('INSERT IGNORE INTO stores (id, name, address) VALUES (1, "BMW Pittsburgh", "Pittsburgh, PA")');
    
    // Insert locations
    for (const location of LOCATIONS) {
      await pool.query(
        'INSERT IGNORE INTO locations (id, name, store_id) VALUES (?, ?, ?)',
        [location.id, location.name, location.store_id]
      );
      console.log(`Added location: ${location.name}`);
    }
    
    console.log('Locations table populated successfully!');
  } catch (error) {
    console.error('Error populating locations:', error);
  } finally {
    await pool.end();
  }
}

populateLocations(); 