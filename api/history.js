import db from './_db.js';

export default async function handler(req, res) {
  try {
    if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });
    // We'll return history from signatures and verifications, interleaved by date
    const signaturesQuery = `
      SELECT 
        s.id, 
        kp.name AS key_name, 
        'Sign' AS operation, 
        s.message AS message, 
        'Success' AS result, 
        s.signed_at AS timestamp
      FROM signatures s
      JOIN key_pairs kp ON s.key_pair_id = kp.id
    `;
    
    const verificationsQuery = `
      SELECT 
        v.id, 
        kp.name AS key_name, 
        'Verify' AS operation, 
        v.recovered_message AS message, 
        CASE WHEN v.is_valid THEN 'Success' ELSE 'Failed' END AS result, 
        v.verified_at AS timestamp
      FROM verifications v
      JOIN key_pairs kp ON v.key_pair_id = kp.id
    `;

    const combinedQuery = `
      (${signaturesQuery})
      UNION ALL
      (${verificationsQuery})
      ORDER BY timestamp DESC
    `;

    const result = await db.query(combinedQuery);
    return res.status(200).json(result.rows);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
}
