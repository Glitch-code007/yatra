import { Navbar } from "@/components/layout/navbar"
import { Hero } from "@/components/landing/hero"
import { FeaturedDestinations } from "@/components/landing/featured-destinations"
import { HowItWorks } from "@/components/landing/how-it-works"
import { FeaturesGrid } from "@/components/landing/features-grid"
import { CtaSection } from "@/components/landing/cta-section"
import { Footer } from "@/components/layout/footer"

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <Navbar />
      <main className="flex-1">
        <Hero />
        <FeaturedDestinations />
        <HowItWorks />
        <FeaturesGrid />
        <CtaSection />
      </main>
      <Footer />
    </div>
  )
}
