import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Data to Decision 🎯 — Curtin Open Day',
  description:
    'Run your own ice cream shop and discover how statistics and optimisation help make smarter decisions. An interactive game by Curtin University.',
  openGraph: {
    title: 'Can You Run a Successful Ice Cream Shop?',
    description: 'An interactive game about statistics & optimisation — Curtin University Open Day',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-display antialiased">{children}</body>
    </html>
  );
}
