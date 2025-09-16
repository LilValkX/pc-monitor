import { query } from '../../lib/db';

export default async function handler(req, res) {
  try {
    await query(`
      CREATE TABLE IF NOT EXISTS machine_data (
        id SERIAL PRIMARY KEY,
        machine_id TEXT,
        timestamp TIMESTAMPTZ DEFAULT NOW(),
        cpu_usage REAL,
        ram_usage REAL,
        gpu_usage REAL,
        roblox_count INTEGER,
        watt REAL
      )
    `);
    
    res.status(200).json({ message: 'Tables created successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}