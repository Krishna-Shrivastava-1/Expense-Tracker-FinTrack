import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import ServiceWorkerRegister from "@/components/service-worker-register";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Define your deployment URL here for absolute paths
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://xpensehub.com";

export const metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "XpenseHub | Personal Financial Charting & Tracking",
    template: "%s | XpenseHub",
  },
  description: "A premium, dynamic personal financial charting application to manage and analyze your expenses.",
  keywords: ["personal finance", "expense tracker", "financial charting", "budgeting tool", "wealth management"],
  manifest: "/manifest.json",
  authors: [{ name: "XpenseHub Team" }],
  creator: "XpenseHub",
  publisher: "XpenseHub",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "XpenseHub - Personal Financial Charting",
    description: "Premium dynamic personal financial charting application.",
    url: siteUrl,
    siteName: "XpenseHub",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/og-image.png", // Place an OG image in your public folder
        width: 1200,
        height: 630,
        alt: "XpenseHub financial dashboard",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "XpenseHub - Personal Financial Charting",
    description: "Premium dynamic personal financial charting application.",
    images: ["/og-image.png"],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "XpenseHub",
  },
  // If you want to use the Meta Tag verification method instead of the HTML file,
  // uncomment the line below and replace 'your-code-here' with your actual code:
  // verification: {
  //   google: "your-google-verification-code",
  // },
};

// Next.js 14+ recommends defining viewport-related metadata in a viewport export
export const viewport = {
  themeColor: "#4F46E5",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col font-sans">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <ServiceWorkerRegister />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}