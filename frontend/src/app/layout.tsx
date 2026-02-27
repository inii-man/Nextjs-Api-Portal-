import './globals.css';
import { Inter } from 'next/font/google';
import { AuthProvider } from '@/contexts/AuthContext';
import LayoutWrapper from './layout_wrapper';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Pusat Interkoneksi Data Nasional',
  description: 'Portal Manajemen API Pemerintah',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={inter.className}>
        <AuthProvider>
          <LayoutWrapper>
            {children}
          </LayoutWrapper>
        </AuthProvider>
      </body>
    </html>
  );
}
