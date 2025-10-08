import React from "react"
import { Bricolage_Grotesque, Inter } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { Suspense } from "react"
import { ToastProvider } from "@/components/ui/toast.jsx"
import { SiteFooter } from "@/components/site-footer.jsx"
import "./globals.css"

export const metadata = {
  title: "ChainID",
  description: "Blockchain-based Biometric Auth",
  generator: "v0.app",
}

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-bricolage",
  display: "swap",
})
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
})

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${bricolage.variable} ${inter.variable} antialiased`}>
      <body className="font-sans">
        <ToastProvider>
          <Suspense fallback={null}>{children}</Suspense>
          <SiteFooter />
          <Analytics />
        </ToastProvider>
      </body>
    </html>
  )
}
