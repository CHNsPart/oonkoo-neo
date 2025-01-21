// app/layout.tsx
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/wrapper/header";
import { BlobCursor } from "@/components/cursor/blob-cursor";
import Footer from "@/components/pages/footer";
import LoaderWrapper from "@/components/wrapper/loader-wrapper";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { Providers } from "@/components/providers";
import { prisma } from "@/lib/prisma";
import { serializeUser } from "@/lib/utils";
import type { SerializedUser } from "@/types/user";
import { KindeProvider } from "@/components/providers/KindeProvider";

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

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { getUser } = getKindeServerSession();
  const kindeUser = await getUser();
  
  let initialUser: SerializedUser | null = null;

  if (kindeUser?.email) {
    // Fetch user from database
    const dbUser = await prisma.user.findUnique({
      where: { email: kindeUser.email }
    });

    // Serialize the user if found
    if (dbUser) {
      initialUser = serializeUser(dbUser);
      if (initialUser) {
        initialUser.isAdmin = initialUser.email === "imchn24@gmail.com";
      }
    }
  }

  return (
    <html lang="en">
      <body 
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-black min-h-screen relative`}
        style={{ isolation: 'isolate' }}
      >
        <Providers initialUser={initialUser}>
          <KindeProvider>
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
          </KindeProvider>
        </Providers>
      </body>
    </html>
  );
}