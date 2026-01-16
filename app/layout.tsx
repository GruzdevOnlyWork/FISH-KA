import type React from "react"
import type { Metadata } from "next"
import { Nunito } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"

const nunito = Nunito({ subsets: ["latin", "cyrillic"] })

export const metadata: Metadata = {
  title: "FISH-KA | Рыболовный магазин",
  description: "Магазин рыболовных товаров FISH-KA - удочки, катушки, приманки, снасти и аксессуары для рыбалки",
    
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ru">
      <body className={`${nunito.className} antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
