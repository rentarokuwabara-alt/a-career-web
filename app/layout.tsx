import type { Metadata } from 'next';
import Layout from '@/components/Layout';
import './globals.css';

export const metadata: Metadata = {
  title: 'A-Career Business OS',
  description: 'Internal business management tool',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body>
        <Layout>{children}</Layout>
      </body>
    </html>
  );
}
