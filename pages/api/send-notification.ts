import { NextApiRequest, NextApiResponse } from 'next';
import webpush from 'web-push';
import fs from 'fs';
import path from 'path';

const SUBSCRIPTIONS_FILE_PATH = path.join(process.cwd(), 'subscriptions.json');

const publicVapidKey = process.env.NEXT_PUBLIC_VAPID_KEY!;
const privateVapidKey = process.env.PRIVATE_VAPID_KEY!;

webpush.setVapidDetails(
  'mailto:exemple@example.com',
  publicVapidKey,
  privateVapidKey,
);

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const payload = JSON.stringify({
      title: 'Test Push',
      message: 'Hello, you have a new notification!',
      icon: '/icons/android-chrome-192x192',
    });

    // Lire les abonnements à partir du fichier
    const subscriptions = JSON.parse(
      fs.readFileSync(SUBSCRIPTIONS_FILE_PATH, 'utf8'),
    );

    console.log('subscriptions', subscriptions);

    // Envoyer des notifications à toutes les souscriptions stockées
    subscriptions.forEach((subscription: any) => {
      console.log('subscription', subscription);
      webpush
        .sendNotification(subscription, payload)
        .then((result) => console.log('Notification sent', result))
        .catch((error) => console.error('Error sending notification', error));
    });

    res.status(200).json({ message: 'Notifications sent' });
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
