import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === 'POST') {
    const { endpoint, keys } = req.body;
    try {
      const subscription = await prisma.subscription.create({
        data: {
          endpoint,
          keys,
        },
      });
      res.status(200).json({ message: 'Subscription accepted', subscription });
    } catch (error) {
      console.error('Failed to save subscription', error);
      res.status(500).json({ message: 'Failed to save subscription' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
