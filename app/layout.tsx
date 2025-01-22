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

export const metadata: Metadata = {
  title: "OonkoO | Modern Digital Solutions for Business Growth",
  description: "Transform your business with OonkoO's cutting-edge digital solutions. We specialize in web development, mobile apps, and enterprise solutions for forward-thinking businesses.",
  keywords: "digital agency, web development, mobile apps, enterprise solutions, digital transformation, IT services, software development",
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
