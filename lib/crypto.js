import * as bigintCryptoUtils from "bigint-crypto-utils";

function positiveMod(n, m) {
  return ((n % m) + m) % m;
}

export async function generateKeyPair(name = "Unnamed Key") {
  const steps = [];

  const q = BigInt("295252862807111886336422253543053326993");
  const p = BigInt(
    "79201402662378061203149770623026163527362916222582790942826933613730175808197",
  );
  const g = BigInt(
    "26281769923533232597996559290003806923029769941240338539514158611122862341106",
  );

  steps.push({ label: "System prime q (160-bit)", value: q.toString() });
  steps.push({ label: "System prime p (512-bit)", value: p.toString() });
  steps.push({ label: "Generator g of order q", value: g.toString() });

  const x = bigintCryptoUtils.randBetween(q - 1n, 2n);
  steps.push({
    label: "Generate private key x (1 < x < q)",
    value: x.toString(),
  });

  const y = bigintCryptoUtils.modPow(g, x, p);
  steps.push({
    label: "Compute public key y = g^x mod p",
    value: y.toString(),
  });

  return { p, q, g, x, y, steps };
}

export function signMessage(messageStr, p, q, g, x) {
  const steps = [];
  const mHex = Buffer.from(messageStr, "utf8").toString("hex");
  const m = BigInt("0x" + mHex);
  steps.push({ label: "Convert message to integer (m)", value: m.toString() });
  if (m >= p) {
    throw new Error("Message integer is larger than p. Try a shorter message.");
  }
  const k = bigintCryptoUtils.randBetween(q - 1n, 2n);
  steps.push({
    label: "Generate ephemeral random k (1 < k < q)",
    value: k.toString(),
  });
  const gk = bigintCryptoUtils.modPow(g, k, p);
  steps.push({ label: "Compute g^k mod p", value: gk.toString() });
  const r = (m * gk) % p;
  steps.push({ label: "Compute r = (m · g^k) mod p", value: r.toString() });
  const s = positiveMod(k - r * x, q);
  steps.push({ label: "Compute s = (k - r · x) mod q", value: s.toString() });
  return { r, s, steps };
}

export function verifyMessage(r, s, p, q, g, y) {
  const steps = [];
  const gs = bigintCryptoUtils.modPow(g, s, p);
  const yr = bigintCryptoUtils.modPow(y, r % q, p);
  const gk_recovered = (gs * yr) % p;
  steps.push({
    label: "Compute (g^s · y^r) mod p",
    value: gk_recovered.toString(),
  });
  const inverse = bigintCryptoUtils.modInv(gk_recovered, p);
  steps.push({ label: "Compute modular inverse", value: inverse.toString() });
  const m_recovered = (r * inverse) % p;
  steps.push({
    label: "Recover integer m' = r · inverse mod p",
    value: m_recovered.toString(),
  });
  let recovered_message = "";
  let isValid = false;
  try {
    let hex = m_recovered.toString(16);
    if (hex.length % 2 !== 0) hex = "0" + hex;
    recovered_message = Buffer.from(hex, "hex").toString("utf8");
    const reHex = Buffer.from(recovered_message, "utf8").toString("hex");
    isValid =
      (reHex === hex || reHex === hex.replace(/^0+/, "")) &&
      recovered_message.length > 0;
  } catch (e) {
    isValid = false;
  }
  steps.push({
    label: "Decode integer to string",
    value: recovered_message || "[Decoding Failed]",
  });
  return { recovered_message, isValid, steps };
}
