import { urlBase64ToUint8Array } from '@/lib/utils';
import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import { useEffect } from 'react';

export default function App({ Component, pageProps }: AppProps) {
  async function subscribeToNotifications() {
    const serviceWorker = await navigator.serviceWorker.ready;
    const applicationServerKey = urlBase64ToUint8Array(
      process.env.NEXT_PUBLIC_VAPID_KEY!,
    );

    const subscription = await serviceWorker.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey,
    });

    await fetch('/api/subscribe', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(subscription),
    });

    console.log('Subscribed!');
  }

  useEffect(() => {
    if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
      navigator.serviceWorker
        .register('/sw.js')
        .then((registration) => {
          console.log(
            'Service Worker registered with scope:',
            registration.scope,
          );
          subscribeToNotifications();
        })
        .catch((err) => {
          console.error('Service Worker registration failed:', err);
        });
    }
  }, []);

  return <Component {...pageProps} />;
}
