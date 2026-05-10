import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { verifyMessage } from '@/lib/crypto';

export const dynamic = 'force-dynamic';

export async function POST(req) {
  try {
    const body = await req.json();
    const { keyPairId, r: rStr, s: sStr } = body;
    
    if (!keyPairId || !rStr || !sStr) {
      return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
    }

    const keyDoc = await db.collection('keyPairs').doc(keyPairId).get();
    if (!keyDoc.exists) {
      return NextResponse.json({ error: 'Key pair not found' }, { status: 404 });
    }
    
    const { p: pStr, g: gStr, y: yStr } = keyDoc.data();
    const p = BigInt(pStr);
    const g = BigInt(gStr);
    const y = BigInt(yStr);
    
    const r = BigInt(rStr);
    const s = BigInt(sStr);

    const { recovered_message, isValid, steps } = verifyMessage(r, s, p, g, y);

    const verifiedAt = new Date().toISOString();
    const docRef = await db.collection('verifications').add({
      keyPairId,
      r: rStr,
      s: sStr,
      recoveredMessage: recovered_message,
      isValid,
      verifiedAt
    });

    return NextResponse.json({ 
      id: docRef.id,
      recovered_message, 
      isValid, 
      steps 
    }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
