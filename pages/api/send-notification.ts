import { NextApiRequest, NextApiResponse } from 'next';
import webpush from 'web-push';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const publicVapidKey = process.env.NEXT_PUBLIC_VAPID_KEY!;
const privateVapidKey = process.env.PRIVATE_VAPID_KEY!;

webpush.setVapidDetails(
  'mailto:exemple@example.com',
  publicVapidKey,
  privateVapidKey,
);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === 'GET') {
    const payload = JSON.stringify({
      title: 'Test Push',
      message: 'Hello, you have a new notification!',
      icon: '/icons/android-chrome-192x192',
    });

    try {
      const subscriptions = await prisma.subscription.findMany();
      console.log('subscriptions', subscriptions);

      subscriptions.forEach((subscription: any) => {
        console.log('subscription', subscription);
        webpush
          .sendNotification(subscription, payload)
          .then((result) => console.log('Notification sent', result))
          .catch((error) => console.error('Error sending notification', error));
      });

      res.status(200).json({ message: 'Notifications sent' });
    } catch (error) {
      console.error('Failed to fetch subscriptions', error);
      res.status(500).json({ message: 'Failed to fetch subscriptions' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
