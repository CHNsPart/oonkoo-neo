import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/wrapper/header";
import { BlobCursor } from "@/components/cursor/blob-cursor";
import Footer from "@/components/pages/footer";
import LoaderWrapper from "@/components/wrapper/loader-wrapper";
import { KindeProvider } from "@/components/providers/auth-provider";
import Script from "next/script";
import { SpeedInsights } from "@vercel/speed-insights/next"
import { Analytics } from "@vercel/analytics/react"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://oonkoo.com';

export const metadata: Metadata = {
  title: {
    default: "OonkoO | Modern Digital Solutions for Business Growth",
    template: "%s | OonkoO"
  },
  description: "Transform your business with OonkoO's cutting-edge digital solutions. We specialize in web development, mobile apps, and enterprise solutions for forward-thinking businesses.",
  keywords: "digital agency, web development, mobile apps, enterprise solutions, digital transformation, IT services, software development",
  metadataBase: new URL(baseUrl),
  authors: [{ name: "OonkoO", url: baseUrl }],
  creator: "OonkoO",
  publisher: "OonkoO",
  formatDetection: {
    email: true,
    address: true,
    telephone: true,
  },
  alternates: {
    canonical: '/',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-video-preview': -1,
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: baseUrl,
    title: 'OonkoO | Modern Digital Solutions for Business Growth',
    description: 'Transform your business with OonkoO\'s cutting-edge digital solutions. We specialize in web development, mobile apps, and enterprise solutions.',
    siteName: 'OonkoO',
    images: [
      {
        url: `${baseUrl}/og-image.png`,
        width: 1200,
        height: 630,
        alt: 'OonkoO Digital Solutions',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'OonkoO | Modern Digital Solutions for Business Growth',
    description: 'Transform your business with OonkoO\'s cutting-edge digital solutions. We specialize in web development, mobile apps, and enterprise solutions.',
    images: [`${baseUrl}/og-image.png`],
    creator: '@OonkoOHQ',
    site: '@OonkoOHQ',
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
  manifest: `${baseUrl}/manifest.json`,
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
  },
  verification: {
    google: '3hc41Pih61XITkFiheo1u0SFNNeL_BGgLbmy1Vixy1M',
    yandex: 'verification_token',
    yahoo: 'verification_token',
    other: {
      me: ['oonkoo.mail@gmail.com'],
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <SpeedInsights/>
      <Analytics />
      {/* Google Analytics */}
      <Script
        src="https://www.googletagmanager.com/gtag/js?id=G-W4HD10V1HG"
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-W4HD10V1HG');
        `}
      </Script>
        <Script id="facebook-pixel" strategy="afterInteractive">
        {`
          !function(f,b,e,v,n,t,s)
          {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
          n.callMethod.apply(n,arguments):n.queue.push(arguments)};
          if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
          n.queue=[];t=b.createElement(e);t.async=!0;
          t.src=v;s=b.getElementsByTagName(e)[0];
          s.parentNode.insertBefore(t,s)}(window, document,'script',
          'https://connect.facebook.net/en_US/fbevents.js');
          fbq('init', '2301839860213124');
          fbq('track', 'PageView');
        `}
      </Script>
      <KindeProvider>
        <body 
          className={`${geistSans.variable} ${geistMono.variable} antialiased bg-black min-h-screen relative`}
          style={{ isolation: 'isolate' }} // Create new stacking context
        >
          <LoaderWrapper>
            <BlobCursor />
            <div className="relative z-[1]">
              <Header />
              <main className="relative z-[1]">
                {children}
              </main>
              <Footer />
            </div>
          </LoaderWrapper>
        </body>
      </KindeProvider>
    </html>
  );
}
