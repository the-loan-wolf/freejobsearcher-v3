import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Script from "next/script";

const geistSans = localFont({
  src: "../../public/fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "../../public/fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "FreeJobSearcher",
  description: "Find Job while sitting at your home",
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
        <meta property="og:site_name" content={"FreeJobSearcher"} />
        <meta
          property="og:description"
          content={"Find Job while sitting at your home"}
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
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
