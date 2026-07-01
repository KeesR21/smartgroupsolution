import type { Metadata } from "next";
import { NotificationProvider } from "@/components/providers/NotificationProvider";
import { ThemeInit } from "@/components/ThemeInit";
import { fontSans, fontVariables } from "@/lib/fonts";
import "./globals.css";

export const metadata: Metadata = {
  title: "Smart Group Solution | Technology Solutions Company",
  description:
    "Smart Group Solution — Modernize. Protect. Scale. AI agents, cybersecurity, compliance, and cloud solutions for African enterprises.",
  keywords: [
    "technology solutions",
    "web development",
    "cloud solutions",
    "digital transformation",
    "IT consulting",
    "cybersecurity",
  ],
  openGraph: {
    title: "Smart Group Solution | Technology Solutions Company",
    description:
      "Innovating today, building tomorrow. Full-spectrum technology services for modern enterprises.",
    type: "website",
  },
  robots: { index: true, follow: true },
  icons: {
    icon: "/logo.svg",
    apple: "/logo.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark scroll-smooth" suppressHydrationWarning>
      <body className={`${fontVariables} ${fontSans.className} font-sans antialiased`}>
        <ThemeInit />
        <NotificationProvider>
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[200] focus:rounded-lg focus:bg-neon-blue focus:px-4 focus:py-2 focus:text-white"
        >
          Skip to main content
        </a>
        {children}
        </NotificationProvider>
      </body>
    </html>
  );
}
