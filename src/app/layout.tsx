import type {Metadata} from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { AppShell } from '@/components/agrivision/AppShell';
import { ThemeProvider } from '@/components/ThemeProvider';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { FieldsProvider } from '@/contexts/FieldsContext';

export const metadata: Metadata = {
  title: 'AgriVision AI',
  description: 'AI-Powered Crop Yield Prediction and Optimization',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Noto+Sans+Oriya:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <LanguageProvider>
            <FieldsProvider>
              <AppShell>
                {children}
              </AppShell>
              <Toaster />
            </FieldsProvider>
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
