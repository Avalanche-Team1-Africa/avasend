import Link from "next/link"
import { Send } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TransferForm } from "@/components/transfer-form"
import { TransactionHistory } from "@/components/transaction-history"
import { VirtualCards } from "@/components/virtual-cards"
import { WalletProvider } from "@/components/wallet-provider"

export default function Dashboard() {
  return (
    <WalletProvider>
      <div className="flex min-h-screen flex-col">
        <header className="border-b">
          <div className="container flex h-16 items-center justify-between py-4">
            <div className="flex items-center gap-2">
              <Send className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold">AvaSend</span>
            </div>
            <nav className="hidden md:flex gap-6">
              <Link href="/" className="text-sm font-medium text-muted-foreground">
                Home
              </Link>
              <Link href="/dashboard" className="text-sm font-medium">
                Dashboard
              </Link>
              <Link href="/transfers" className="text-sm font-medium text-muted-foreground">
                Transfers
              </Link>
              <Link href="/cards" className="text-sm font-medium text-muted-foreground">
                Cards
              </Link>
            </nav>
            <div className="flex items-center gap-4">
              <Button variant="outline" size="sm" asChild>
                <Link href="/faucet">Get Testnet USDC</Link>
              </Button>
            </div>
          </div>
        </header>
        <main className="flex-1 container py-6 md:py-12">
          <div className="flex flex-col gap-8">
            <div className="flex flex-col gap-2">
              <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
              <p className="text-muted-foreground">Manage your transfers and virtual cards.</p>
            </div>
            <Tabs defaultValue="send" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="send">Send Money</TabsTrigger>
                <TabsTrigger value="history">Transaction History</TabsTrigger>
                <TabsTrigger value="cards">Virtual Cards</TabsTrigger>
              </TabsList>
              <TabsContent value="send" className="mt-6">
                <TransferForm />
              </TabsContent>
              <TabsContent value="history" className="mt-6">
                <TransactionHistory />
              </TabsContent>
              <TabsContent value="cards" className="mt-6">
                <VirtualCards />
              </TabsContent>
            </Tabs>
          </div>
        </main>
        <footer className="border-t py-6">
          <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
            <div className="flex items-center gap-2">
              <Send className="h-5 w-5 text-primary" />
              <p className="text-sm text-muted-foreground">© 2025 AvaSend. All rights reserved.</p>
            </div>
            <div className="flex gap-4 text-sm text-muted-foreground">
              <Link href="/terms">Terms</Link>
              <Link href="/privacy">Privacy</Link>
              <Link href="/contact">Contact</Link>
            </div>
          </div>
        </footer>
      </div>
    </WalletProvider>
  )
}
