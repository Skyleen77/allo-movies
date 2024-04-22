import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';

const SUBSCRIPTIONS_FILE_PATH = path.join(process.cwd(), 'subscriptions.json');

function saveSubscriptionToFile(subscription: any) {
  // Lire le fichier actuel ou utiliser un tableau vide si le fichier n'existe pas
  const currentSubscriptions = fs.existsSync(SUBSCRIPTIONS_FILE_PATH)
    ? JSON.parse(fs.readFileSync(SUBSCRIPTIONS_FILE_PATH, 'utf8'))
    : [];

  // Ajouter la nouvelle souscription
  currentSubscriptions.push(subscription);

  // Écrire la mise à jour dans le fichier
  fs.writeFileSync(
    SUBSCRIPTIONS_FILE_PATH,
    JSON.stringify(currentSubscriptions, null, 2),
  );
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const subscription = req.body;
    saveSubscriptionToFile(subscription);
    res.status(200).json({ message: 'Subscription accepted' });
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
