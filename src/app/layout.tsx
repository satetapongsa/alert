import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Thailand Real-Time Incident Map | แผนที่สถานการณ์เรียลไทม์ประเทศไทย',
  description: 'แผนที่สถานการณ์แบบ Real-Time ที่ประชาชนช่วยกันรายงาน น้ำท่วม รถติด อุบัติเหตุ ถนนปิด และสถานะรถไฟฟ้า BTS/MRT ทั่วกรุงเทพฯ และประเทศไทย',
  manifest: '/manifest.json',
  icons: {
    icon: '/favicon.ico',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#090d16',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="th" className="dark h-full antialiased">
      <body className="min-h-full bg-[#090d16] text-[#f1f5f9] flex flex-col font-sans select-none">
        {children}
      </body>
    </html>
  );
}
