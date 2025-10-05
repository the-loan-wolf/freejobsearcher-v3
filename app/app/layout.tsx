import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Suspense } from "react"
import { ParticleBackground } from "@/components/app-components/particle-background"
import "./globals.css"

export const metadata: Metadata = {
  title: "FreeJobSearcher - Find Your Perfect Candidate",
  description: "Modern job search platform connecting employers with talented professionals",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable} antialiased`}>
        <ParticleBackground />
        <div className="relative z-10">
          <Suspense fallback={null}>{children}</Suspense>
        </div>
      </body>
    </html>
  )
}
