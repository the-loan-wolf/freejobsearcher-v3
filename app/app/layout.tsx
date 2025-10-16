import type React from "react";
import type { Metadata } from "next";
import Script from "next/script";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { Suspense } from "react";
import { ParticleBackground } from "@/components/app-components/particle-background";
import "./globals.css";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: "FreeJobSearcher - Find Your Perfect Candidate",
  description:
    "Modern job search platform connecting employers with talented professionals",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* <!-- Google tag (gtag.js) --> */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-NMT1XBV8YT"
          strategy="afterInteractive"
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
      window.dataLayer = window.dataLayer || [];
      function gtag(){ dataLayer.push(arguments); }
      gtag('js', new Date());
      gtag('config', 'G-NMT1XBV8YT');
    `,
          }}
        />
        <meta
          property="og:title"
          content={"FreeJobSearcher | Find Job while sitting at your home"}
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={"https://freejobsearcher.com"} />
        <meta
          property="og:image"
          content="https://freejobsearcher.com/freejobsearcher.avif"
        />

        {/* Twitter Cards */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={"FreeJobSearcher"} />
        <meta
          name="twitter:description"
          content="Find Job while sitting at your home"
        />
        <meta
          name="twitter:image"
          content="https://freejobsearcher.com/freejobsearcher.avif"
        />
      </head>
      <body
        className={`font-sans ${GeistSans.variable} ${GeistMono.variable} antialiased`}
      >
        {/* <ParticleBackground /> */}
        <div className="relative z-10">
          <Providers>
            <Suspense fallback={null}>{children}</Suspense>
          </Providers>
        </div>
      </body>
    </html>
  );
}
