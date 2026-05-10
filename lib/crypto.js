import * as bigintCryptoUtils from 'bigint-crypto-utils';

function positiveMod(n, m) {
  return ((n % m) + m) % m;
}

export async function generateKeyPair(name = 'Unnamed Key') {
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
      const isPrime = await bigintCryptoUtils.isProbablyPrime(p, 10);
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

  return { p, q, g, x, y, steps };
}

export function signMessage(messageStr, p, q, g, x) {
  const steps = [];
  const mHex = Buffer.from(messageStr, 'utf8').toString('hex');
  const m = BigInt('0x' + mHex);
  steps.push({ label: 'Convert message to integer (m)', value: m.toString() });

  if (m >= p) {
     throw new Error('Message integer is larger than p. Try a shorter message.');
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

  return { r, s, steps };
}

export function verifyMessage(r, s, p, g, y) {
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

  return { recovered_message, isValid, steps };
}
