import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { signMessage } from '@/lib/crypto';

export const dynamic = 'force-dynamic';

export async function POST(req) {
  try {
    const body = await req.json();
    const { keyPairId, message } = body;
    
    if (!keyPairId || !message) {
      return NextResponse.json({ error: 'Missing keyPairId or message' }, { status: 400 });
    }

    const keyDoc = await db.collection('keyPairs').doc(keyPairId).get();
    if (!keyDoc.exists) {
      return NextResponse.json({ error: 'Key pair not found' }, { status: 404 });
    }
    
    const { p: pStr, q: qStr, g: gStr, x: xStr } = keyDoc.data();
    const p = BigInt(pStr);
    const q = BigInt(qStr);
    const g = BigInt(gStr);
    const x = BigInt(xStr);

    const { r, s, steps } = signMessage(message, p, q, g, x);

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

    return NextResponse.json({ signature, steps }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
