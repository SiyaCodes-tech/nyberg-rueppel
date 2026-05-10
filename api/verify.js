import db from './_firebase.js';
import * as bigintCryptoUtils from 'bigint-crypto-utils';

export default async function handler(req, res) {
  try {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
    const { keyPairId, r: rStr, s: sStr } = req.body;
    if (!keyPairId || !rStr || !sStr) return res.status(400).json({ error: 'Missing parameters' });

    const keyDoc = await db.collection('keyPairs').doc(keyPairId).get();
    if (!keyDoc.exists) return res.status(404).json({ error: 'Key pair not found' });
    
    const { p: pStr, g: gStr, y: yStr } = keyDoc.data();
    const p = BigInt(pStr);
    const g = BigInt(gStr);
    const y = BigInt(yStr);
    
    const r = BigInt(rStr);
    const s = BigInt(sStr);

    const steps = [];

    // Compute g^s mod p
    const gs = bigintCryptoUtils.modPow(g, s, p);
    
    // Compute y^r mod p
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
      
      const reHex = Buffer.from(recovered_message, 'utf8').toString('hex');
      isValid = (reHex === hex || reHex === hex.replace(/^0+/, '')) && recovered_message.length > 0;
    } catch (e) {
      isValid = false;
    }

    steps.push({ label: 'Decode integer to string', value: recovered_message || '[Decoding Failed]' });

    // Save verification to Firestore
    const verifiedAt = new Date().toISOString();
    const docRef = await db.collection('verifications').add({
      keyPairId,
      r: rStr,
      s: sStr,
      recoveredMessage: recovered_message,
      isValid,
      verifiedAt
    });

    return res.status(200).json({ 
      id: docRef.id,
      recovered_message, 
      isValid, 
      steps 
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
}
