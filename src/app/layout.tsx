import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Providers } from "@/components/providers"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
})

export const metadata: Metadata = {
  title: {
    default: "Yatra — Intelligent India Travel Planning",
    template: "%s | Yatra",
  },
  description:
    "Plan smarter trips across India with AI-powered itineraries, budget planning, safety guides, and interactive maps. Discover, plan, and explore with confidence.",
  keywords: [
    "India travel",
    "trip planner",
    "travel itinerary",
    "India tourism",
    "budget travel India",
    "travel safety India",
    "AI travel assistant",
  ],
  authors: [{ name: "Yatra" }],
  openGraph: {
    title: "Yatra — Intelligent India Travel Planning",
    description:
      "Plan smarter trips across India with AI-powered itineraries, budget planning, safety guides, and interactive maps.",
    type: "website",
    locale: "en_IN",
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
