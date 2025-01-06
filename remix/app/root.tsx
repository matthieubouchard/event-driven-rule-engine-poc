import type { LinksFunction } from '@remix-run/node';
import { Links, Meta, Outlet, Scripts, ScrollRestoration } from '@remix-run/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import Nav from './components/Nav';
import { NotificationToast } from './components/NotificationToast';
import { useServerNotifications } from './hooks/api/useServerNotifications';
import styles from './tailwind.css';

export const links: LinksFunction = () => [
  { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
  {
    rel: 'preconnect',
    href: 'https://fonts.gstatic.com',
    crossOrigin: 'anonymous',
  },
  {
    rel: 'stylesheet',
    href: 'https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap',
  },
  { rel: 'stylesheet', href: styles },
];

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-theme="light" style={{ background: '#310b56' }}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body style={{ background: '#310b56' }}>
        <Nav />
        <div className="container mx-auto py-10">{children}</div>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  const { notifications } = useServerNotifications();
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 1000,
        refetchOnWindowFocus: false,
        retry: 1,
      },
    },
  });
  return (
    <>
      <div className="fixed top-4 right-10 z-50 flex flex-col gap-2 w-1/4">
        {notifications.map((notification) => (
          <div key={notification.id}>
            <NotificationToast
              type={notification.type}
              title={notification.type}
              message={JSON.stringify(notification.payload.payload, null, 2)}
              isVisible={notification.isVisible}
            />
          </div>
        ))}
      </div>
      <QueryClientProvider client={queryClient}>
        <Outlet />;
      </QueryClientProvider>
    </>
  );
}
