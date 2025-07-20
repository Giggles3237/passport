import pool from '../db/index.js';

const CORRECT_LOCATIONS = [
  { id: 1, name: 'Lawrenceville', store_id: 1 },
  { id: 2, name: 'Strip District', store_id: 1 },
  { id: 3, name: 'Downtown', store_id: 1 },
  { id: 4, name: 'Bloomfield', store_id: 1 },
  { id: 5, name: 'Shadyside', store_id: 1 }
];

async function fixLocations() {
  try {
    console.log('Fixing locations table...');
    
    // First, ensure we have a store
    await pool.query('INSERT IGNORE INTO stores (id, name, address) VALUES (1, "BMW Pittsburgh", "Pittsburgh, PA")');
    
    // Show current locations before fixing
    const [beforeLocations] = await pool.query('SELECT id, name FROM locations ORDER BY id');
    console.log('\nLocations before fixing:');
    beforeLocations.forEach(loc => {
      console.log(`  ${loc.id}: ${loc.name}`);
    });
    
    // Update existing locations to correct names
    for (const location of CORRECT_LOCATIONS) {
      await pool.query(
        'UPDATE locations SET name = ?, store_id = ? WHERE id = ?',
        [location.name, location.store_id, location.id]
      );
      console.log(`Updated location ${location.id} to: ${location.name}`);
    }
    
    // Check if we need to add any missing locations
    const [existingLocations] = await pool.query('SELECT id FROM locations ORDER BY id');
    const existingIds = existingLocations.map(loc => loc.id);
    
    for (const location of CORRECT_LOCATIONS) {
      if (!existingIds.includes(location.id)) {
        await pool.query(
          'INSERT INTO locations (id, name, store_id) VALUES (?, ?, ?)',
          [location.id, location.name, location.store_id]
        );
        console.log(`Added missing location: ${location.name}`);
      }
    }
    
    // Remove any extra locations (like regent_square)
    const correctIds = CORRECT_LOCATIONS.map(loc => loc.id);
    const extraLocations = existingIds.filter(id => !correctIds.includes(id));
    
    for (const extraId of extraLocations) {
      // First, update any visits that reference this location to point to Downtown (ID 3)
      await pool.query('UPDATE visits SET location_id = 3 WHERE location_id = ?', [extraId]);
      console.log(`Updated visits from location ${extraId} to Downtown`);
      
      // Then delete the extra location
      await pool.query('DELETE FROM locations WHERE id = ?', [extraId]);
      console.log(`Removed extra location with ID ${extraId}`);
    }
    
    // Show final locations
    const [finalLocations] = await pool.query('SELECT id, name FROM locations ORDER BY id');
    console.log('\nFinal locations in database:');
    finalLocations.forEach(loc => {
      console.log(`  ${loc.id}: ${loc.name}`);
    });
    
    console.log('\nLocations table fixed successfully!');
  } catch (error) {
    console.error('Error fixing locations:', error);
  } finally {
    await pool.end();
  }
}

fixLocations(); 