import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "AI Reference Assistant",
  description: "Your smart assistant for AI references and documentation.",
  icons: {
    icon: "/icon.png",
    apple: "/icon.png",
  },
  openGraph: {
    title: "AI Reference Assistant",
    description: "Your smart assistant for AI references and documentation.",
    url: "https://ai-reference-assistant.vercel.app",
    siteName: "AI Reference Assistant",
    images: [
      {
        url: "/icon.png",
        width: 1200,
        height: 630,
        alt: "AI Reference Assistant",
      },
    ],
    type: "website",
  },
  twitter: {
    // card: "summary_large_image",
    title: "AI Reference Assistant",
    description: "Your smart assistant for AI references and documentation.",
    images: ["/icon.png"],
  },
  viewport: "width=device-width, initial-scale=1",
  themeColor: "#ffffff",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <meta name="theme-color" content="#ffffff" />
        <meta name="description" content="Your smart assistant for AI references and documentation." />
        <meta property="og:title" content="AI Reference Assistant" />
        <meta property="og:description" content="Your smart assistant for AI references and documentation." />
        <meta property="og:image" content="/og-image.png" />
        <meta property="og:url" content="https://your-domain.com" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="AI Reference Assistant" />
        <meta name="twitter:description" content="Your smart assistant for AI references and documentation." />
        <meta name="twitter:image" content="/og-image.png" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
