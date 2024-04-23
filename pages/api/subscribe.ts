import { NextApiRequest, NextApiResponse } from 'next';
import sanityClient from '@sanity/client';
import { client } from '@/lib/client';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === 'POST') {
    const { endpoint, keys } = req.body;
    try {
      await client.create({
        _type: 'subscription',
        endpoint,
        keys,
      });
      res.status(200).json({ message: 'Subscription saved' });
    } catch (error) {
      console.error('Error saving subscription', error);
      res.status(500).json({ message: 'Failed to save subscription' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
