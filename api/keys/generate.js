import db from '../../_db.js';
import * as bigintCryptoUtils from 'bigint-crypto-utils';

export default async function handler(req, res) {
  try {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

    const { name = 'Unnamed Key' } = req.body || {};

    const steps = [];
    
    // 1. Generate q (160-bit prime)
    const q = await bigintCryptoUtils.prime(160);
    steps.push({ label: 'Generate q (160-bit prime)', value: q.toString() });

    // 2. Find p = k*q + 1 such that p is a 512-bit prime
    let p, k;
    let iterations = 0;
    while (true) {
      iterations++;
      k = bigintCryptoUtils.randBetween(2n ** 352n, 2n ** 351n);
      if (k % 2n !== 0n) k += 1n;
      
      p = k * q + 1n;
      if (p >= 2n ** 511n && p < 2n ** 512n) {
        const isPrime = await bigintCryptoUtils.isProbablePrime(p, 10);
        if (isPrime) break;
      }
      if (iterations > 1000) {
         throw new Error("Failed to find prime p within timeout limit.");
      }
    }
    steps.push({ label: 'Find k such that p = k*q + 1 is a 512-bit prime', value: `k = ${k.toString()}` });
    steps.push({ label: 'Generate p (512-bit prime)', value: p.toString() });

    // 3. Find generator g of order q
    let g, h;
    while (true) {
      h = bigintCryptoUtils.randBetween(p - 2n, 2n);
      g = bigintCryptoUtils.modPow(h, k, p);
      if (g > 1n) break;
    }
    steps.push({ label: 'Generate generator g of order q (g = h^k mod p)', value: g.toString() });

    // 4. Generate private key x
    const x = bigintCryptoUtils.randBetween(q - 1n, 2n);
    steps.push({ label: 'Generate private key x (1 < x < q)', value: x.toString() });

    // 5. Compute public key y = g^x mod p
    const y = bigintCryptoUtils.modPow(g, x, p);
    steps.push({ label: 'Compute public key y = g^x mod p', value: y.toString() });

    // Save to DB
    const result = await db.query(
      `INSERT INTO key_pairs (name, p, q, g, x, y) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id, created_at`,
      [name, p.toString(), q.toString(), g.toString(), x.toString(), y.toString()]
    );

    const keyPair = {
      id: result.rows[0].id,
      name,
      p: p.toString(),
      q: q.toString(),
      g: g.toString(),
      x: x.toString(),
      y: y.toString(),
      created_at: result.rows[0].created_at
    };

    return res.status(200).json({ keyPair, steps });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
}
