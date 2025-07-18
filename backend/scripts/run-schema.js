import pool from '../db/index.js';
import fs from 'fs';
import path from 'path';

async function runSchema() {
  try {
    console.log('Running database schema...');
    
    // Read the schema file
    const schemaPath = path.join(process.cwd(), 'schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');
    
    // Split by semicolon and execute each statement
    const statements = schema.split(';').filter(stmt => stmt.trim());
    
    for (const statement of statements) {
      if (statement.trim()) {
        try {
          await pool.query(statement);
          console.log('✓ Executed:', statement.substring(0, 50) + '...');
        } catch (error) {
          if (error.code === 'ER_TABLE_EXISTS_ERROR') {
            console.log('⚠ Table already exists, skipping...');
          } else {
            console.error('✗ Error executing statement:', error.message);
          }
        }
      }
    }
    
    console.log('Schema execution completed!');
  } catch (error) {
    console.error('Error running schema:', error);
  } finally {
    await pool.end();
  }
}

runSchema(); 