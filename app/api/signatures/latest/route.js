import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const snapshot = await db.collection('signatures')
      .orderBy('signedAt', 'desc')
      .limit(1)
      .get();
    
    if (snapshot.empty) {
      return NextResponse.json({}, { status: 200 });
    }

    const doc = snapshot.docs[0];
    return NextResponse.json({ id: doc.id, ...doc.data() }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}