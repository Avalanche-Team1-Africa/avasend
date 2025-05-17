import Link from "next/link"
import { ArrowRight, Award, Send } from "lucide-react"

import { Button } from "@/components/ui/button"
import { HeroSection } from "@/components/hero-section"
import { FeatureSection } from "@/components/feature-section"
import { DemoSection } from "@/components/demo-section"
import { WalletConnect } from "@/components/wallet-connect"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-md border-b">
        <div className="container flex h-16 items-center justify-between py-4">
          <div className="flex items-center gap-2">
            <div className="bg-primary p-1.5 rounded-md">
              <Send className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold">AvaSend</span>
          </div>
          <nav className="hidden md:flex gap-8">
            <Link href="/" className="text-sm font-medium">
              Home
            </Link>
            <Link
              href="/dashboard"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Dashboard
            </Link>
            <Link
              href="/features"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Features
            </Link>
            <Link
              href="/faucet"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Get Testnet USDC
            </Link>
          </nav>
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm" asChild className="hidden md:flex">
              <Link href="/faucet">Get Testnet USDC</Link>
            </Button>
            <WalletConnect />
          </div>
        </div>
      </header>
      <main className="flex-1 pt-16">
        <HeroSection />
        <FeatureSection />
        <DemoSection />

        {/* CTA Section */}
        <section className="py-20 bg-primary/5">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center text-center space-y-4 md:space-y-6">
              <div className="inline-block rounded-full bg-primary/10 p-2 mb-4">
                <div className="rounded-full bg-primary/20 p-2">
                  <Award className="h-6 w-6 text-primary" />
                </div>
              </div>
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
                Ready to Revolutionize Cross-Border Payments?
              </h2>
              <p className="max-w-[700px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Join the future of decentralized remittance today and experience seamless, low-cost transfers across
                borders.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 min-[400px]:flex-row pt-4">
                <Button asChild size="lg" className="h-12 px-8 font-medium">
                  <Link href="/dashboard">
                    Get Started <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button variant="outline" size="lg" asChild className="h-12 px-8 font-medium">
                  <Link href="/faucet">Get Testnet USDC</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Partners Section */}
        <section className="py-12 border-t">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4">
              <h3 className="text-xl font-medium text-center text-muted-foreground">Powered By</h3>
              <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12 py-8">
                <div className="flex items-center gap-2 grayscale opacity-70 hover:grayscale-0 hover:opacity-100 transition-all">
                  <img src="/avalanche-logo.png" alt="Avalanche" className="h-10" />
                </div>
                <div className="flex items-center gap-2 grayscale opacity-70 hover:grayscale-0 hover:opacity-100 transition-all">
                  <img src="/intasend-logo.png" alt="IntaSend" className="h-10" />
                </div>
                <div className="flex items-center gap-2 grayscale opacity-70 hover:grayscale-0 hover:opacity-100 transition-all">
                  <img src="/stripe-logo.png" alt="Stripe" className="h-10" />
                </div>
                <div className="flex items-center gap-2 grayscale opacity-70 hover:grayscale-0 hover:opacity-100 transition-all">
                  <img src="/mpesa-logo.png" alt="M-Pesa" className="h-10" />
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="border-t py-12 bg-muted/30">
        <div className="container px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="bg-primary p-1.5 rounded-md">
                  <Send className="h-5 w-5 text-primary-foreground" />
                </div>
                <span className="text-xl font-bold">AvaSend</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Decentralized, fully automated cross-border remittance dApp built on Avalanche.
              </p>
              <div className="flex space-x-4">
                <Link href="#" className="text-muted-foreground hover:text-foreground">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-5 w-5"
                  >
                    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
                  </svg>
                </Link>
                <Link href="#" className="text-muted-foreground hover:text-foreground">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-5 w-5"
                  >
                    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                    <rect width="4" height="12" x="2" y="9"></rect>
                    <circle cx="4" cy="4" r="2"></circle>
                  </svg>
                </Link>
                <Link href="#" className="text-muted-foreground hover:text-foreground">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-5 w-5"
                  >
                    <path d="M12 2H2v10h10V2zM22 2h-8v8h8V2zM12 14H2v8h10v-8zM22 14h-8v8h8v-8z"></path>
                  </svg>
                </Link>
              </div>
            </div>
            <div>
              <h3 className="text-sm font-medium mb-4">Product</h3>
              <ul className="space-y-3 text-sm">
                <li>
                  <Link href="#" className="text-muted-foreground hover:text-foreground">
                    Features
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-muted-foreground hover:text-foreground">
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-muted-foreground hover:text-foreground">
                    API
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-muted-foreground hover:text-foreground">
                    Documentation
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-medium mb-4">Resources</h3>
              <ul className="space-y-3 text-sm">
                <li>
                  <Link href="#" className="text-muted-foreground hover:text-foreground">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-muted-foreground hover:text-foreground">
                    Developers
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-muted-foreground hover:text-foreground">
                    Support
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-muted-foreground hover:text-foreground">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-medium mb-4">Legal</h3>
              <ul className="space-y-3 text-sm">
                <li>
                  <Link href="#" className="text-muted-foreground hover:text-foreground">
                    Terms
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-muted-foreground hover:text-foreground">
                    Privacy
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-muted-foreground hover:text-foreground">
                    Cookies
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-muted-foreground hover:text-foreground">
                    Licenses
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-muted-foreground">© 2025 AvaSend. All rights reserved.</p>
            <p className="text-sm text-muted-foreground mt-4 md:mt-0">Built with ❤️ for the Avalanche Hackathon</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
