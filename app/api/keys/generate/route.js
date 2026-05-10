import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { generateKeyPair } from '@/lib/crypto';

export const dynamic = 'force-dynamic';

export async function POST(req) {
  try {
    const body = await req.json();
    const name = body.name || 'Unnamed Key';

    const { p, q, g, x, y, steps } = await generateKeyPair(name);

    const createdAt = new Date().toISOString();
    const docRef = await db.collection('keyPairs').add({
      name,
      p: p.toString(),
      q: q.toString(),
      g: g.toString(),
      x: x.toString(),
      y: y.toString(),
      createdAt
    });

    const keyPair = {
      id: docRef.id,
      name,
      p: p.toString(),
      q: q.toString(),
      g: g.toString(),
      x: x.toString(),
      y: y.toString(),
      created_at: createdAt
    };

    return NextResponse.json({ keyPair, steps }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
