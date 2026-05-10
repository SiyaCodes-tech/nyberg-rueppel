# Nyberg-Rueppel Digital Signature Scheme

A full-stack web application demonstrating the Nyberg-Rueppel Digital Signature Scheme with message recovery. Built completely on Next.js App Router, using Firebase Firestore and deployed to Vercel.

## Tech Stack
- **Frontend/Backend:** Next.js (App Router), React, Tailwind CSS
- **Database:** Firebase Firestore (Serverless)
- **Math Engine:** JavaScript native `BigInt` with `bigint-crypto-utils`
- **Deployment:** Vercel

## Mathematical Overview
Unlike standard DSA where a message must be sent alongside its signature, the Nyberg-Rueppel scheme embeds the original message directly into the mathematical structure of the signature itself. When verified, the original plaintext message is automatically recovered.

- **Key Generation:** Generates large primes `p` and `q` and keys `x` and `y`.
- **Signing:** Computes `r = (m · g^k) mod p` and `s = (k - r·x) mod q`.
- **Verify & Recover:** Computes `(g^s · y^r) mod p`, then recovers message `m'`.

## Setup & Deployment

1. **Install Dependencies:**
   ```bash
   npm install
   ```

2. **Environment Variables:**
   Create a `.env` or `.env.local` file based on `.env.example`:
   ```env
   FIREBASE_PROJECT_ID=your_project_id
   FIREBASE_CLIENT_EMAIL=your_client_email
   FIREBASE_PRIVATE_KEY="your_private_key_with_\n_newlines"
   ```

3. **Development Server:**
   ```bash
   npm run dev
   ```

4. **Production Build:**
   ```bash
   npm run build
   npm start
   ```

## Firebase Configuration
Ensure your Firebase Service Account has access to Firestore. The application will automatically create three collections on first use:
- `keyPairs`
- `signatures`
- `verifications`

## Constraints & Security
- The web application strictly enforces a **128-character limit** on the message input.
- For interactive demonstration speeds, **512-bit safe primes** are generated (taking roughly 2-5 seconds). A secure production environment would require primes of 2048 bits or higher.
