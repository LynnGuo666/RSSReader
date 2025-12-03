import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'RSS Reader',
  description: 'A modern RSS reader application',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
