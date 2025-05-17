"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { ArrowRight, CheckCircle2 } from "lucide-react"
import { motion } from "framer-motion"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export function HeroSection() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 overflow-hidden">
      <div className="container px-4 md:px-6">
        <div className="grid gap-6 lg:grid-cols-[1fr_600px] lg:gap-12 xl:grid-cols-[1fr_750px]">
          <motion.div
            className="flex flex-col justify-center space-y-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="space-y-2">
              <Badge className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-primary text-primary-foreground hover:bg-primary/80">
                Avalanche Hackathon Finalist
              </Badge>
              <motion.h1
                className="text-4xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
              >
                Borderless Remittance, Reimagined
              </motion.h1>
              <motion.p
                className="max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.5 }}
              >
                AvaSend is a decentralized, fully automated cross-border remittance dApp built on Avalanche, allowing
                migrants to send USDC instantly with automatic cash-out to mobile money wallets.
              </motion.p>
            </div>
            <motion.div
              className="flex flex-col gap-2 min-[400px]:flex-row"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              <Button asChild size="lg" className="h-12 px-8 font-medium">
                <Link href="/dashboard">
                  Launch App <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild className="h-12 px-8 font-medium">
                <Link href="/learn-more">How It Works</Link>
              </Button>
            </motion.div>
            <motion.div
              className="flex items-center space-x-4 text-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.5 }}
            >
              <div className="flex items-center">
                <CheckCircle2 className="mr-1 h-4 w-4 text-primary" />
                <span>Instant Transfers</span>
              </div>
              <div className="flex items-center">
                <CheckCircle2 className="mr-1 h-4 w-4 text-primary" />
                <span>Low Fees</span>
              </div>
              <div className="flex items-center">
                <CheckCircle2 className="mr-1 h-4 w-4 text-primary" />
                <span>Virtual Cards</span>
              </div>
            </motion.div>
          </motion.div>
          <motion.div
            className="flex items-center justify-center lg:justify-end"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <div className="relative w-full max-w-[600px]">
              <div className="absolute -top-12 -left-12 w-40 h-40 bg-primary/10 rounded-full blur-3xl" />
              <div className="absolute -bottom-12 -right-12 w-40 h-40 bg-primary/10 rounded-full blur-3xl" />

              <div className="relative z-10 rounded-2xl overflow-hidden border shadow-2xl">
                <div className="bg-gradient-to-br from-primary/5 via-background to-background p-1">
                  <div className="rounded-xl overflow-hidden bg-white">
                    <div className="flex items-center justify-between bg-muted/30 px-4 py-2 border-b">
                      <div className="flex items-center space-x-2">
                        <div className="h-3 w-3 rounded-full bg-red-500" />
                        <div className="h-3 w-3 rounded-full bg-yellow-500" />
                        <div className="h-3 w-3 rounded-full bg-green-500" />
                      </div>
                      <div className="text-xs font-medium">AvaSend Dashboard</div>
                      <div className="w-16" />
                    </div>
                    <img
                      src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/mpesa-MPeHKZal7Du549xSiS9O8aOMDzTOZO.jpeg"
                      alt="M-Pesa Mobile Interface"
                      className="w-full h-auto"
                    />
                  </div>
                </div>
              </div>

              <div className="absolute -right-8 -bottom-8 z-20 rounded-xl overflow-hidden border shadow-xl w-48 h-48 bg-white">
                <div className="bg-gradient-to-br from-primary to-primary/80 p-4 h-full flex flex-col justify-between">
                  <div className="flex justify-between items-start">
                    <div className="text-white">
                      <p className="text-xs opacity-80">Virtual Card</p>
                      <h3 className="text-sm font-semibold">AvaSend Card</h3>
                    </div>
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
                      className="h-5 w-5 text-white"
                    >
                      <rect width="20" height="14" x="2" y="5" rx="2" />
                      <line x1="2" x2="22" y1="10" y2="10" />
                    </svg>
                  </div>
                  <div className="text-white">
                    <p className="text-xs tracking-widest">•••• •••• •••• 4242</p>
                    <div className="mt-1 flex justify-between text-xs">
                      <div>
                        <p className="opacity-80">Expires</p>
                        <p>12/28</p>
                      </div>
                      <div className="text-right">
                        <p className="opacity-80">Balance</p>
                        <p>500 USDC</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="absolute -left-8 top-1/4 z-20 rounded-xl overflow-hidden border shadow-xl w-48 bg-white">
                <div className="p-3 space-y-2">
                  <div className="flex items-center space-x-2">
                    <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center">
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
                        className="h-4 w-4 text-primary"
                      >
                        <path d="m22 2-7 20-4-9-9-4Z" />
                        <path d="M22 2 11 13" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-xs font-medium">Transfer Complete</p>
                      <p className="text-xs text-muted-foreground">To: +254 712 345 678</p>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-bold">250 USDC</span>
                    <Badge variant="outline" className="text-xs">
                      M-Pesa
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
