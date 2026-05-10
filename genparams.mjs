import { prime, randBetween, modPow, isProbablyPrime } from 'bigint-crypto-utils';

const q = await prime(128);
let p, k;
while (true) {
  k = randBetween(BigInt(2**128), BigInt(2**127));
  p = k * q + 1n;
  if (await isProbablyPrime(p, 20)) break;
}
let g;
while (true) {
  const h = randBetween(p - 2n, 2n);
  g = modPow(h, k, p);
  if (g > 1n) break;
}
console.log(`q: ${q}`);
console.log(`p: ${p}`);
console.log(`g: ${g}`);