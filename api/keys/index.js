const db = require('../../_db');

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });
  try {
    const result = await db.query(
      `SELECT id, name, p, q, g, y, created_at FROM key_pairs ORDER BY id DESC`
    );
    return res.status(200).json(result.rows);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
