import db from '../_db.js';
import * as bigintCryptoUtils from 'bigint-crypto-utils';

export default async function handler(req, res) {
  try {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
    const { keyPairId, r: rStr, s: sStr } = req.body;
    if (!keyPairId || !rStr || !sStr) return res.status(400).json({ error: 'Missing parameters' });

    const keyQuery = await db.query(`SELECT p, q, g, y FROM key_pairs WHERE id = $1`, [keyPairId]);
    if (keyQuery.rows.length === 0) return res.status(404).json({ error: 'Key pair not found' });
    
    const { p: pStr, g: gStr, y: yStr } = keyQuery.rows[0];
    const p = BigInt(pStr);
    const g = BigInt(gStr);
    const y = BigInt(yStr);
    
    const r = BigInt(rStr);
    const s = BigInt(sStr);

    const steps = [];

    // Compute g^s mod p
    const gs = bigintCryptoUtils.modPow(g, s, p);
    
    // Compute y^r mod p
    // r might be large, but modPow handles it. Or we can use y^(r mod q) if we had q, but y^r mod p is mathematically identical because y = g^x and g has order q.
    const yr = bigintCryptoUtils.modPow(y, r, p);
    
    // Compute (g^s * y^r) mod p
    const gk_recovered = (gs * yr) % p;
    steps.push({ label: 'Compute (g^s · y^r) mod p', value: gk_recovered.toString() });

    // Compute inverse of gk_recovered mod p
    const inverse = bigintCryptoUtils.modInv(gk_recovered, p);
    steps.push({ label: 'Compute modular inverse of (g^s · y^r mod p)', value: inverse.toString() });

    // Recover m' = r * inverse mod p
    const m_recovered = (r * inverse) % p;
    steps.push({ label: "Recover integer m' = r · inverse mod p", value: m_recovered.toString() });

    // Convert integer back to text
    let recovered_message = '';
    let isValid = false;
    try {
      let hex = m_recovered.toString(16);
      if (hex.length % 2 !== 0) hex = '0' + hex;
      recovered_message = Buffer.from(hex, 'hex').toString('utf8');
      
      // Simple heuristic to check if it's readable text (no weird non-printable characters)
      // We will consider it valid if it decoded to a string without throwing, 
      // but let's strictly check if it looks like UTF-8.
      // Buffer.from doesn't throw on invalid UTF-8, it just inserts replacement characters.
      // A better check: encoding it back to hex should match.
      const reHex = Buffer.from(recovered_message, 'utf8').toString('hex');
      isValid = (reHex === hex || reHex === hex.replace(/^0+/, '')) && recovered_message.length > 0;
    } catch (e) {
      isValid = false;
    }

    steps.push({ label: 'Decode integer to string', value: recovered_message || '[Decoding Failed]' });

    // Save verification
    const result = await db.query(
      `INSERT INTO verifications (key_pair_id, r, s, recovered_message, is_valid) VALUES ($1, $2, $3, $4, $5) RETURNING id, verified_at`,
      [keyPairId, rStr, sStr, recovered_message, isValid]
    );

    return res.status(200).json({ 
      id: result.rows[0].id,
      recovered_message, 
      isValid, 
      steps 
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
}
