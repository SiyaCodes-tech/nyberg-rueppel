import db from '../_firebase.js';

export default async function handler(req, res) {
  try {
    if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });
    
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

    return res.status(200).json(keys);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
}
