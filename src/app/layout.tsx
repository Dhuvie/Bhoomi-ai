import type { Metadata, Viewport } from "next";
import { Space_Grotesk, Noto_Sans, Noto_Sans_Devanagari, Noto_Sans_Oriya, Noto_Sans_Telugu } from "next/font/google";
import "./globals.css";
import { Toaster as SonnerToaster } from "@/components/ui/sonner";
import { ThemeProvider } from "next-themes";
import { AppProviders } from "@/components/bhoomi/providers";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["500", "700"],
  display: "swap",
});

const notoSans = Noto_Sans({
  variable: "--font-noto-sans",
  subsets: ["latin"],
  display: "swap",
});

const notoDevanagari = Noto_Sans_Devanagari({
  variable: "--font-noto-devanagari",
  subsets: ["devanagari"],
  weight: ["400", "500", "700"],
  display: "swap",
});

const notoOriya = Noto_Sans_Oriya({
  variable: "--font-noto-oriya",
  subsets: ["oriya"],
  weight: ["400", "700"],
  display: "swap",
});

const notoTelugu = Noto_Sans_Telugu({
  variable: "--font-noto-telugu",
  subsets: ["telugu"],
  weight: ["400", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Bhoomi - Field Intelligence for Indian Farmers",
  description: "Yield forecasts, pest & disease diagnosis, soil analysis, field management, weather and market prices - built for the realities of Indian farming.",
  keywords: ["agriculture", "India", "farmer", "yield prediction", "pest diagnosis", "soil analysis", "Hindi", "Odia", "Telugu"],
  authors: [{ name: "Bhoomi" }],
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#FAF7F2" },
    { media: "(prefers-color-scheme: dark)", color: "#241E17" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${spaceGrotesk.variable} ${notoSans.variable} ${notoDevanagari.variable} ${notoOriya.variable} ${notoTelugu.variable} antialiased`}
        style={{
          fontFamily: "var(--font-body)",
        }}
      >
        <style>{`
          :root {
            --font-heading-en: 'Space Grotesk', var(--font-space-grotesk), sans-serif;
            --font-heading-in: var(--font-noto-devanagari), var(--font-noto-oriya), var(--font-noto-telugu), sans-serif;
            --font-body: var(--font-noto-sans), var(--font-noto-devanagari), var(--font-noto-oriya), var(--font-noto-telugu), sans-serif;
          }
        `}</style>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false} disableTransitionOnChange>
          <AppProviders>
            {children}
          </AppProviders>
          <SonnerToaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
