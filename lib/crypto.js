import * as bigintCryptoUtils from 'bigint-crypto-utils';

function positiveMod(n, m) {
  return ((n % m) + m) % m;
}

export async function generateKeyPair(name = 'Unnamed Key') {
  const steps = [];

  const q = BigInt('1000231219878316916125931434731577233100698506691');
  const p = BigInt('7379327921648153907039969697839322791000808523039607555464484241108670487800244726956931308206671745893744676946898498752702419694745876735956791098682691');
  const g = BigInt('3794344731796096951225498092271491813376007568036508688774862044578867744700809283591839748583442523552649649792948143027817571997104990617584093038988823');

  steps.push({ label: 'System prime q (160-bit)', value: q.toString() });
  steps.push({ label: 'System prime p (512-bit)', value: p.toString() });
  steps.push({ label: 'Generator g of order q', value: g.toString() });

  const x = bigintCryptoUtils.randBetween(q - 1n, 2n);
  steps.push({ label: 'Generate private key x (1 < x < q)', value: x.toString() });

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
  const k = bigintCryptoUtils.randBetween(q - 1n, 2n);
  steps.push({ label: 'Generate ephemeral random k (1 < k < q)', value: k.toString() });
  const gk = bigintCryptoUtils.modPow(g, k, p);
  steps.push({ label: 'Compute g^k mod p', value: gk.toString() });
  const r = (m * gk) % p;
  steps.push({ label: 'Compute r = (m · g^k) mod p', value: r.toString() });
  const s = positiveMod(k - (r % q) * x, q);
  steps.push({ label: 'Compute s = (k - r · x) mod q', value: s.toString() });
  return { r, s, steps };
}

export function verifyMessage(r, s, p, g, y) {
  const steps = [];
  const gs = bigintCryptoUtils.modPow(g, s, p);
  const yr = bigintCryptoUtils.modPow(y, r, p);
  const gk_recovered = (gs * yr) % p;
  steps.push({ label: 'Compute (g^s · y^r) mod p', value: gk_recovered.toString() });
  const inverse = bigintCryptoUtils.modInv(gk_recovered, p);
  steps.push({ label: 'Compute modular inverse', value: inverse.toString() });
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