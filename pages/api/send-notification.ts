import { NextApiRequest, NextApiResponse } from 'next';
import sanityClient from '@sanity/client';
import webpush from 'web-push';
import { client } from '@/lib/client';

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
      const query = '*[_type == "subscription"]';
      const subscriptions = await client.fetch(query);
      subscriptions.forEach(async (subscription: any) => {
        try {
          await webpush.sendNotification(subscription, payload);
          console.log('Notification sent');
        } catch (error) {
          console.error('Error sending notification', error);
        }
      });
      res.status(200).json({ message: 'Notifications sent' });
    } catch (error) {
      console.error('Error fetching subscriptions', error);
      res.status(500).json({ message: 'Failed to send notifications' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
