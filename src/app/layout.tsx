import './globals.css';
import Providers from './providers';

export const metadata = {
  title: 'High-Throughput Analytics Dashboard',
  description: 'Real-time telemetry and data streaming dashboard',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-slate-950 text-slate-100 antialiased min-h-screen">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}