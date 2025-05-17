"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { ArrowRight, CreditCard, Send, Wallet } from "lucide-react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export function DemoSection() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <section className="w-full py-12 md:py-24 lg:py-32">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <div className="inline-block rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
              How It Works
            </div>
            <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">See AvaSend in Action</h2>
            <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl/relaxed">
              Experience the simplicity and power of decentralized remittance with our interactive demo.
            </p>
          </div>
        </div>
        <div className="mx-auto max-w-5xl mt-16">
          <Tabs defaultValue="send" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-8">
              <TabsTrigger value="send" className="text-sm md:text-base py-3">
                <Send className="mr-2 h-4 w-4" />
                Send Money
              </TabsTrigger>
              <TabsTrigger value="receive" className="text-sm md:text-base py-3">
                <Wallet className="mr-2 h-4 w-4" />
                Mobile Money
              </TabsTrigger>
              <TabsTrigger value="cards" className="text-sm md:text-base py-3">
                <CreditCard className="mr-2 h-4 w-4" />
                Virtual Cards
              </TabsTrigger>
            </TabsList>
            <TabsContent value="send" className="mt-0">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="grid md:grid-cols-2 gap-8 items-center"
              >
                <div className="space-y-4">
                  <h3 className="text-2xl font-bold">Send Money Globally in Seconds</h3>
                  <p className="text-muted-foreground">
                    Connect your Avalanche wallet, enter the recipient's mobile money details, and send USDC instantly.
                    No more waiting days for international transfers to clear.
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-start">
                      <div className="flex-shrink-0 flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-primary font-medium text-sm mr-3 mt-0.5">
                        1
                      </div>
                      <p>Connect your Avalanche-compatible wallet</p>
                    </div>
                    <div className="flex items-start">
                      <div className="flex-shrink-0 flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-primary font-medium text-sm mr-3 mt-0.5">
                        2
                      </div>
                      <p>Enter recipient's phone number and select mobile money provider</p>
                    </div>
                    <div className="flex items-start">
                      <div className="flex-shrink-0 flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-primary font-medium text-sm mr-3 mt-0.5">
                        3
                      </div>
                      <p>Send USDC with one click - funds arrive in seconds</p>
                    </div>
                  </div>
                  <Button asChild>
                    <Link href="/dashboard">
                      Try It Now <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
                <div className="relative">
                  <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 to-primary/10 rounded-xl blur-lg opacity-50"></div>
                  <div className="relative rounded-xl overflow-hidden border shadow-lg">
                    <img
                      src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/sendmoney-cIO45ssqg2nmOPl8caWzF74tyL4NnT.jpeg"
                      alt="Send Money to M-PESA"
                      className="w-full h-auto"
                    />
                  </div>
                </div>
              </motion.div>
            </TabsContent>
            <TabsContent value="receive" className="mt-0">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="grid md:grid-cols-2 gap-8 items-center"
              >
                <div className="space-y-4">
                  <h3 className="text-2xl font-bold">Automatic Cash-Out to Mobile Money</h3>
                  <p className="text-muted-foreground">
                    Recipients don't need crypto knowledge or wallets. Funds are automatically cashed out to their
                    M-Pesa or Airtel Money wallets via IntaSend integration.
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-start">
                      <div className="flex-shrink-0 flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-primary font-medium text-sm mr-3 mt-0.5">
                        1
                      </div>
                      <p>USDC is sent from sender's wallet to AvaSend smart contract</p>
                    </div>
                    <div className="flex items-start">
                      <div className="flex-shrink-0 flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-primary font-medium text-sm mr-3 mt-0.5">
                        2
                      </div>
                      <p>IntaSend API is triggered to initiate mobile money transfer</p>
                    </div>
                    <div className="flex items-start">
                      <div className="flex-shrink-0 flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-primary font-medium text-sm mr-3 mt-0.5">
                        3
                      </div>
                      <p>Recipient receives funds directly to their mobile money wallet</p>
                    </div>
                  </div>
                  <Button asChild>
                    <Link href="/dashboard">
                      Try It Now <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
                <div className="relative">
                  <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 to-primary/10 rounded-xl blur-lg opacity-50"></div>
                  <div className="relative rounded-xl overflow-hidden border shadow-lg">
                    <img
                      src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/mpesa-MPeHKZal7Du549xSiS9O8aOMDzTOZO.jpeg"
                      alt="M-Pesa Mobile Interface"
                      className="w-full h-auto"
                    />
                  </div>
                </div>
              </motion.div>
            </TabsContent>
            <TabsContent value="cards" className="mt-0">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="grid md:grid-cols-2 gap-8 items-center"
              >
                <div className="space-y-4">
                  <h3 className="text-2xl font-bold">Virtual Debit Cards for Online Spending</h3>
                  <p className="text-muted-foreground">
                    Create Stripe testnet virtual debit cards mapped to your wallet for online spending. No need to
                    convert crypto to fiat first.
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-start">
                      <div className="flex-shrink-0 flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-primary font-medium text-sm mr-3 mt-0.5">
                        1
                      </div>
                      <p>Create a virtual card with your desired USDC balance</p>
                    </div>
                    <div className="flex items-start">
                      <div className="flex-shrink-0 flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-primary font-medium text-sm mr-3 mt-0.5">
                        2
                      </div>
                      <p>Receive card details instantly (number, expiry, CVV)</p>
                    </div>
                    <div className="flex items-start">
                      <div className="flex-shrink-0 flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-primary font-medium text-sm mr-3 mt-0.5">
                        3
                      </div>
                      <p>Use your card for online purchases anywhere Visa is accepted</p>
                    </div>
                  </div>
                  <Button asChild>
                    <Link href="/dashboard">
                      Try It Now <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
                <div className="relative">
                  <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 to-primary/10 rounded-xl blur-lg opacity-50"></div>
                  <div className="relative rounded-xl overflow-hidden border shadow-lg">
                    <img
                      src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/virtualcard-Iz1OUOIPmQd8L4rpxW18DVJcmaTJN5.jpeg"
                      alt="Virtual Visa Card"
                      className="w-full h-auto"
                    />
                  </div>
                </div>
              </motion.div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </section>
  )
}
