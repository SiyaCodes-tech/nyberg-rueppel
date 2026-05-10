import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const snapshot = await db.collection('keyPairs').orderBy('createdAt', 'desc').get();
    const keys = [];
    
    snapshot.forEach(doc => {
      const data = doc.data();
      keys.push({
        id: doc.id,
        name: data.name,
        p: data.p,
        q: data.q,
        g: data.g,
        y: data.y,
        created_at: data.createdAt
      });
    });

    return NextResponse.json(keys, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
