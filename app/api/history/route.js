import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const signaturesSnapshot = await db.collection('signatures').get();
    const verificationsSnapshot = await db.collection('verifications').get();
    const keysSnapshot = await db.collection('keyPairs').get();

    const keyNames = {};
    keysSnapshot.forEach(doc => {
      keyNames[doc.id] = doc.data().name;
    });

    const history = [];

    signaturesSnapshot.forEach(doc => {
      const data = doc.data();
      history.push({
        id: doc.id,
        key_name: keyNames[data.keyPairId] || 'Unknown',
        operation: 'Sign',
        message: data.message,
        result: 'Success',
        timestamp: data.signedAt
      });
    });

    verificationsSnapshot.forEach(doc => {
      const data = doc.data();
      history.push({
        id: doc.id,
        key_name: keyNames[data.keyPairId] || 'Unknown',
        operation: 'Verify',
        message: data.recoveredMessage,
        result: data.isValid ? 'Success' : 'Failed',
        timestamp: data.verifiedAt
      });
    });

    history.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    return NextResponse.json(history, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
