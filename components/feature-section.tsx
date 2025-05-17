"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { CreditCard, Globe, Landmark, Send, Shield, Wallet } from "lucide-react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export function FeatureSection() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  const features = [
    {
      icon: <Send className="h-12 w-12 text-primary" />,
      title: "Instant Cross-Border Transfers",
      description: "Send USDC instantly to anyone, anywhere in the world with minimal fees and no intermediaries.",
    },
    {
      icon: <Globe className="h-12 w-12 text-primary" />,
      title: "Mobile Money Integration",
      description: "Automatic cash-out to M-Pesa or Airtel Money wallets via IntaSend sandbox for recipients.",
    },
    {
      icon: <CreditCard className="h-12 w-12 text-primary" />,
      title: "Virtual Debit Cards",
      description: "Receive automatically issued Stripe testnet debit cards mapped to your wallet for online spending.",
    },
    {
      icon: <Wallet className="h-12 w-12 text-primary" />,
      title: "Avalanche Blockchain",
      description: "Built on Avalanche for fast, secure, and low-cost transactions with finality in seconds.",
    },
    {
      icon: <Shield className="h-12 w-12 text-primary" />,
      title: "Fully Decentralized",
      description: "No central authority or intermediary, giving you complete control over your funds.",
    },
    {
      icon: <Landmark className="h-12 w-12 text-primary" />,
      title: "Regulatory Compliant",
      description: "Designed with compliance in mind while maintaining the benefits of decentralization.",
    },
  ]

  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-muted/30">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <div className="inline-block rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
              Features
            </div>
            <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
              Revolutionizing Cross-Border Payments
            </h2>
            <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl/relaxed">
              AvaSend combines blockchain technology with traditional finance to create a seamless remittance
              experience.
            </p>
          </div>
        </div>
        <div className="mx-auto grid max-w-5xl grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-16">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="h-full bg-background hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="p-2 w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-2">
                    {feature.icon}
                  </div>
                  <CardTitle>{feature.title}</CardTitle>
                  <CardDescription>{feature.description}</CardDescription>
                </CardHeader>
                <CardContent></CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
