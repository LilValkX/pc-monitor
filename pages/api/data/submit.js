import { query } from '../../../lib/db';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const {
      machine_id,
      cpu_usage,
      ram_usage,
      gpu_usage,
      roblox_count,
      watt
    } = req.body;

    await query(
      `INSERT INTO machine_data 
       (machine_id, cpu_usage, ram_usage, gpu_usage, roblox_count, watt)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [machine_id, cpu_usage, ram_usage, gpu_usage, roblox_count, watt]
    );

    res.status(200).json({ message: 'Data saved successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}