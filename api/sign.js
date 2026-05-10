import db from './_firebase.js';
import * as bigintCryptoUtils from 'bigint-crypto-utils';

function positiveMod(n, m) {
  return ((n % m) + m) % m;
}

export default async function handler(req, res) {
  try {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
    const { keyPairId, message } = req.body;
    if (!keyPairId || !message) return res.status(400).json({ error: 'Missing keyPairId or message' });

    // Fetch key pair from Firestore
    const keyDoc = await db.collection('keyPairs').doc(keyPairId).get();
    if (!keyDoc.exists) return res.status(404).json({ error: 'Key pair not found' });
    
    const { p: pStr, q: qStr, g: gStr, x: xStr } = keyDoc.data();
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

    // Save to Firestore
    const signedAt = new Date().toISOString();
    const docRef = await db.collection('signatures').add({
      keyPairId,
      message,
      r: r.toString(),
      s: s.toString(),
      signedAt
    });

    const signature = {
      id: docRef.id,
      r: r.toString(),
      s: s.toString(),
      signed_at: signedAt
    };

    return res.status(200).json({ signature, steps });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
}
