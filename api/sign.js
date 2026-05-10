import db from '../_db.js';
import * as bigintCryptoUtils from 'bigint-crypto-utils';

function positiveMod(n, m) {
  return ((n % m) + m) % m;
}

export default async function handler(req, res) {
  try {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
    const { keyPairId, message } = req.body;
    if (!keyPairId || !message) return res.status(400).json({ error: 'Missing keyPairId or message' });

    // Fetch key pair
    const keyQuery = await db.query(`SELECT p, q, g, x FROM key_pairs WHERE id = $1`, [keyPairId]);
    if (keyQuery.rows.length === 0) return res.status(404).json({ error: 'Key pair not found' });
    
    const { p: pStr, q: qStr, g: gStr, x: xStr } = keyQuery.rows[0];
    const p = BigInt(pStr);
    const q = BigInt(qStr);
    const g = BigInt(gStr);
    const x = BigInt(xStr);

    const steps = [];

    // Convert message to BigInt
    const mHex = Buffer.from(message, 'utf8').toString('hex');
    const m = BigInt('0x' + mHex);
    steps.push({ label: 'Convert message to integer (m)', value: m.toString() });

    if (m >= p) {
       return res.status(400).json({ error: 'Message integer is larger than p. Try a shorter message.' });
    }

    // Generate ephemeral random k
    const k = bigintCryptoUtils.randBetween(q - 1n, 2n);
    steps.push({ label: 'Generate ephemeral random k (1 < k < q)', value: k.toString() });

    // Compute g^k mod p
    const gk = bigintCryptoUtils.modPow(g, k, p);
    steps.push({ label: 'Compute g^k mod p', value: gk.toString() });

    // Compute r = (m * g^k) mod p
    const r = (m * gk) % p;
    steps.push({ label: 'Compute r = (m · g^k) mod p', value: r.toString() });

    // Compute s = (k - r * x) mod q
    const s = positiveMod(k - (r % q) * x, q);
    steps.push({ label: 'Compute s = (k - r · x) mod q', value: s.toString() });

    // Save to DB
    const result = await db.query(
      `INSERT INTO signatures (key_pair_id, message, r, s) VALUES ($1, $2, $3, $4) RETURNING id, signed_at`,
      [keyPairId, message, r.toString(), s.toString()]
    );

    const signature = {
      id: result.rows[0].id,
      r: r.toString(),
      s: s.toString(),
      signed_at: result.rows[0].signed_at
    };

    return res.status(200).json({ signature, steps });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
}
