import { Outfit } from 'next/font/google';
import './globals.css';

import { SidebarProvider } from '@/context/SidebarContext';
import { ThemeProvider } from '@/context/ThemeContext';
import { AuthProvider } from '@/context/AuthContext';
import { Toaster } from 'react-hot-toast';
import { ModalProvider } from '@/context/ModalContext';
import GlobalModalRenderer from '@/components/modal/GlobalModelRenderer';

const outfit = Outfit({
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${outfit.className} dark:bg-gray-900`}>
        <Toaster position="top-right" />
        <AuthProvider>
          <ModalProvider>
            <ThemeProvider>
              <SidebarProvider>{children}</SidebarProvider>
            </ThemeProvider>
            <GlobalModalRenderer />
          </ModalProvider>
        </AuthProvider>
      </body>
    </html >
  );
}
