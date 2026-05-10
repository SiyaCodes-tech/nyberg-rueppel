# Nyberg-Rueppel Digital Signature Web App

A full-stack web application demonstrating the Nyberg-Rueppel Digital Signature Scheme with message recovery.

## The Nyberg-Rueppel Scheme
The Nyberg-Rueppel scheme is a variant of the Digital Signature Algorithm (DSA) that provides *message recovery*. Unlike standard RSA or DSA where you send the message along with the signature `(m, sig)`, in Nyberg-Rueppel message recovery, the message `m` itself is embedded and hidden within the signature component `r`. Verification of the signature mathematically extracts the original message.

### Math Used in this Application:
**Key Generation:**
1. Generate a large prime `p` and a prime `q` that divides `p-1`.
2. Find generator `g` of order `q`.
3. Choose random private key `x` (1 < x < q).
4. Compute public key `y = g^x mod p`.

**Signing a Message `m`:**
1. Convert message `m` to a big integer.
2. Choose ephemeral random `k` (1 < k < q).
3. Compute `r = (m · g^k) mod p`. *(Note: r is computed modulo p so that m can be fully recovered. Computing r mod q would truncate the message).*
4. Compute `s = (k - r · x) mod q`.
5. The signature is `(r, s)`.

**Verifying & Recovering:**
1. Given `(r, s)` and public key `y, p, g`.
2. Compute `g^s · y^r mod p`.
3. Find the modular inverse of the above result.
4. Recover `m' = r · inverse mod p`.
5. Convert `m'` back from integer to UTF-8 text.

### Why 512-bit Keys?
For security, production cryptographic systems require 2048-bit or 4096-bit primes. However, finding a 2048-bit prime `p` such that `p = k·q + 1` is computationally intensive. Since this application's API is deployed on Vercel Serverless Functions, there is a strict 10-second execution limit. 512-bit parameters are used here solely for demonstration to ensure the key generation finishes within the timeout limits.

---

## Tech Stack
- **Frontend:** React, Tailwind CSS, Vite
- **Backend:** Node.js, Express/Vercel Serverless Functions (`@vercel/node`)
- **Database:** Serverless PostgreSQL (Neon)
- **Cryptography:** Native BigInt, `bigint-crypto-utils`
- **Deployment:** Vercel

---

## Setup & Deployment

### 1. Database Setup (Neon)
1. Create a new PostgreSQL project on [Neon](https://neon.tech/).
2. Open the SQL Editor in your Neon dashboard.
3. Run the SQL schema found in `db/init.sql` to create the `key_pairs`, `signatures`, and `verifications` tables.
4. Copy your PostgreSQL connection string.

### 2. Vercel Deployment
1. Push this repository to GitHub.
2. Import the project in Vercel.
3. Add the Environment Variable `DATABASE_URL` with your Neon connection string.
4. Vercel will automatically detect `vercel.json` for routing:
   - `/api/*` requests go to the serverless backend.
   - `/*` requests go to the React frontend.
5. Deploy!

### 3. Running Locally
1. Clone the repository.
2. In the root directory, create a `.env` file with `DATABASE_URL=your_neon_db_string`.
3. Install backend dependencies: `npm install`
4. Install frontend dependencies: `cd frontend && npm install`
5. Run the Vercel dev server (if Vercel CLI is installed): `vercel dev`
6. Alternatively, to run the frontend independently: `cd frontend && npm run dev`. Note: you'll need to proxy API requests to a local Express server if not using `vercel dev`.

---

## Usage Guide
1. **Key Generation:** Start here. Enter an optional name and click "Generate". Wait for the primes to be generated. The system will display the full math breakdown.
2. **Sign:** Go to the Sign page. Select the key pair you just generated and type a message (max 128 chars). Click Sign. The signature `(r, s)` is generated.
3. **Verify:** Go to the Verify page. Select the key pair, paste the `r` and `s` values, and click Verify. The original message will be mathematically recovered and displayed!
4. **History:** View an audit trail of all signing and verification actions.
