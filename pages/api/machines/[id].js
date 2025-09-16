import { query } from '../../../lib/db';

export default async function handler(req, res) {
  const { id } = req.query;
  
  try {
    // ดึงข้อมูลล่าสุด
    const latest = await query(`
      SELECT * FROM machine_data 
      WHERE machine_id = $1 
      ORDER BY timestamp DESC 
      LIMIT 1
    `, [id]);

    // ดึงข้อมูล 24 ชั่วโมงล่าสุดสำหรับกราฟ
    const history = await query(`
      SELECT * FROM machine_data 
      WHERE machine_id = $1 
      AND timestamp > NOW() - INTERVAL '24 hours'
      ORDER BY timestamp ASC
    `, [id]);

    res.status(200).json({
      latest: latest.rows[0] || null,
      history: history.rows
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}