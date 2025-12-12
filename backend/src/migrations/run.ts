import { readFileSync, existsSync } from 'fs';
import { join } from 'path';
import { pool } from '../config/database';

async function waitForDatabase(maxRetries = 10, delay = 2000) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      const result = await pool.query('SELECT 1');
      return true;
    } catch (error: any) {
      if (i < maxRetries - 1) {
        console.log(`Waiting for database... (${i + 1}/${maxRetries})`);
        await new Promise(resolve => setTimeout(resolve, delay));
      } else {
        throw error;
      }
    }
  }
  return false;
}

async function runMigrations() {
  try {
    // Wait for database to be ready
    console.log('Checking database connection...');
    await waitForDatabase();
    console.log('✅ Database connection established!');
    
    // Try multiple paths to find the SQL file
    const possiblePaths = [
      join(__dirname, '001_initial_schema.sql'), // dist/migrations/
      join(__dirname, '../src/migrations/001_initial_schema.sql'), // from dist
      join(process.cwd(), 'backend/src/migrations/001_initial_schema.sql'), // from project root
      join(process.cwd(), 'src/migrations/001_initial_schema.sql'), // from backend
    ];
    
    let migrationFile = possiblePaths.find(path => existsSync(path));
    
    if (!migrationFile) {
      throw new Error('Migration file not found. Tried: ' + possiblePaths.join(', '));
    }
    
    console.log(`Reading migration from: ${migrationFile}`);
    const sql = readFileSync(migrationFile, 'utf-8');
    
    console.log('Running migration...');
    await pool.query(sql);
    console.log('✅ Migration completed successfully!');
    process.exit(0);
  } catch (error: any) {
    console.error('❌ Migration failed:', error.message);
    if (error.code === 'ECONNREFUSED' || error.message.includes('Connection terminated')) {
      console.error('\n💡 Database connection failed. PostgreSQL may still be starting up.');
      console.error('   Wait a few seconds and try again: node dist/migrations/run.js');
      console.error('   Or check container: docker-compose logs postgres');
    }
    process.exit(1);
  }
}

runMigrations();

