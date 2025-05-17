"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, Loader2, Send } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { WalletConnect } from "@/components/wallet-connect"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

// ABI for ERC20 token (USDC)
const ERC20_ABI = [
  "function balanceOf(address owner) view returns (uint256)",
  "function decimals() view returns (uint8)",
  "function symbol() view returns (string)",
  "function transfer(address to, uint amount) returns (bool)",
  "function mint(address to, uint256 amount) returns (bool)",
  "event Transfer(address indexed from, address indexed to, uint amount)",
]

// Avalanche Fuji Testnet USDC contract address (this is a mock address, replace with actual testnet USDC)
const USDC_CONTRACT_ADDRESS = "0x5425890298aed601595a70AB815c96711a31Bc65" // Mock address, replace with actual testnet USDC

export default function FaucetPage() {
  const [amount, setAmount] = useState("100")
  const [loading, setLoading] = useState(false)
  const [walletAddress, setWalletAddress] = useState("")
  const [isConnected, setIsConnected] = useState(false)
  const [isCorrectNetwork, setIsCorrectNetwork] = useState(false)
  const { toast } = useToast()

  // Function to handle wallet connection status updates
  const handleWalletUpdate = (connected: boolean, address: string, correctNetwork: boolean) => {
    setIsConnected(connected)
    setWalletAddress(address)
    setIsCorrectNetwork(correctNetwork)
  }

  const handleGetTestnetUSDC = async () => {
    if (!isConnected) {
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your wallet to get testnet USDC",
        variant: "destructive",
      })
      return
    }

    if (!isCorrectNetwork) {
      toast({
        title: "Wrong Network",
        description: "Please switch to Avalanche Fuji Testnet",
        variant: "destructive",
      })
      return
    }

    setLoading(true)

    try {
      // In a real implementation, this would call a backend API that mints tokens
      // For this demo, we'll simulate the API call with a delay

      toast({
        title: "Processing Request",
        description: "Sending testnet USDC to your wallet...",
      })

      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 3000))

      // Simulate successful faucet request
      toast({
        title: "Success!",
        description: `${amount} testnet USDC sent to your wallet`,
      })
    } catch (error: any) {
      console.error("Faucet error:", error)
      toast({
        title: "Request Failed",
        description: error.message || "Failed to get testnet USDC. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b">
        <div className="container flex h-16 items-center justify-between py-4">
          <div className="flex items-center gap-2">
            <Send className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">AvaSend</span>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Home
              </Link>
            </Button>
            <WalletConnect onWalletUpdate={handleWalletUpdate} />
          </div>
        </div>
      </header>
      <main className="flex-1 container py-12">
        <div className="max-w-md mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>Testnet USDC Faucet</CardTitle>
              <CardDescription>Get testnet USDC to try out AvaSend features.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {!isConnected ? (
                <div className="flex flex-col items-center justify-center gap-4 py-4">
                  <p className="text-center text-muted-foreground">Connect your wallet to get testnet USDC</p>
                  <WalletConnect onWalletUpdate={handleWalletUpdate} />
                </div>
              ) : (
                <>
                  {!isCorrectNetwork && (
                    <Alert variant="warning" className="mb-4">
                      <AlertTitle>Wrong Network</AlertTitle>
                      <AlertDescription>
                        Please switch to Avalanche Fuji Testnet to receive testnet USDC.
                      </AlertDescription>
                    </Alert>
                  )}
                  <div className="space-y-2">
                    <Label htmlFor="wallet-address">Your Wallet Address</Label>
                    <Input id="wallet-address" value={walletAddress} readOnly />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="amount">Amount (USDC)</Label>
                    <Input
                      id="amount"
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      min="1"
                      max="1000"
                    />
                    <p className="text-xs text-muted-foreground">Maximum 1,000 USDC per request</p>
                  </div>
                </>
              )}
            </CardContent>
            <CardFooter>
              <Button
                className="w-full"
                onClick={handleGetTestnetUSDC}
                disabled={!isConnected || !isCorrectNetwork || loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  "Get Testnet USDC"
                )}
              </Button>
            </CardFooter>
          </Card>
          <div className="mt-6 text-center text-sm text-muted-foreground">
            <p>This is a testnet faucet for demonstration purposes only.</p>
            <p>Testnet USDC has no real value and can only be used on the Avalanche Fuji Testnet.</p>
          </div>
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
  )
}
