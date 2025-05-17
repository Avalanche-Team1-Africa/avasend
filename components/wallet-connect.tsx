"use client"

import { useState, useEffect } from "react"
import { Loader2, Wallet } from "lucide-react"
import { ethers } from "ethers"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { cn } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"

// Avalanche Fuji Testnet details
const AVALANCHE_TESTNET_PARAMS = {
  chainId: "0xA869", // 43113 in hex
  chainName: "Avalanche Fuji Testnet",
  nativeCurrency: {
    name: "AVAX",
    symbol: "AVAX",
    decimals: 18,
  },
  rpcUrls: ["https://api.avax-test.network/ext/bc/C/rpc"],
  blockExplorerUrls: ["https://testnet.snowtrace.io/"],
}

interface WalletConnectProps {
  onWalletUpdate?: (connected: boolean, address: string, correctNetwork: boolean) => void
}

export function WalletConnect({ onWalletUpdate }: WalletConnectProps) {
  const [isConnected, setIsConnected] = useState(false)
  const [walletAddress, setWalletAddress] = useState("")
  const [isCorrectNetwork, setIsCorrectNetwork] = useState(false)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null)
  const { toast } = useToast()

  // Notify parent component about wallet status changes
  useEffect(() => {
    if (onWalletUpdate) {
      onWalletUpdate(isConnected, walletAddress, isCorrectNetwork)
    }
  }, [isConnected, walletAddress, isCorrectNetwork, onWalletUpdate])

  // Check if wallet is already connected on component mount
  useEffect(() => {
    const checkConnection = async () => {
      if (typeof window !== "undefined" && window.ethereum) {
        try {
          // Check if we're already connected
          const accounts = await window.ethereum.request({ method: "eth_accounts" })

          if (accounts.length > 0) {
            const newProvider = new ethers.BrowserProvider(window.ethereum)
            setProvider(newProvider)
            setWalletAddress(accounts[0])
            setIsConnected(true)

            // Check if we're on the correct network
            const network = await newProvider.getNetwork()
            const correctNetwork = network.chainId === 43113n // Fuji testnet chainId
            setIsCorrectNetwork(correctNetwork)
          }
        } catch (error) {
          console.error("Error checking wallet connection:", error)
        }
      }
    }

    checkConnection()

    // Set up event listeners for account and chain changes
    if (typeof window !== "undefined" && window.ethereum) {
      window.ethereum.on("accountsChanged", (accounts: string[]) => {
        if (accounts.length === 0) {
          // User disconnected their wallet
          setIsConnected(false)
          setWalletAddress("")
          setProvider(null)
        } else {
          // User switched accounts
          setWalletAddress(accounts[0])
        }
      })

      window.ethereum.on("chainChanged", async () => {
        if (provider) {
          const network = await provider.getNetwork()
          const correctNetwork = network.chainId === 43113n // Fuji testnet chainId
          setIsCorrectNetwork(correctNetwork)
        }
      })
    }

    // Clean up event listeners
    return () => {
      if (typeof window !== "undefined" && window.ethereum) {
        window.ethereum.removeAllListeners()
      }
    }
  }, [])

  const connectWallet = async () => {
    if (typeof window === "undefined" || !window.ethereum) {
      toast({
        title: "MetaMask not detected",
        description: "Please install MetaMask to connect your wallet",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      // Request account access
      const accounts = await window.ethereum.request({ method: "eth_requestAccounts" })
      const newProvider = new ethers.BrowserProvider(window.ethereum)
      setProvider(newProvider)
      setWalletAddress(accounts[0])
      setIsConnected(true)

      // Check if we're on the correct network
      const network = await newProvider.getNetwork()
      const isCorrectChain = network.chainId === 43113n // Fuji testnet chainId
      setIsCorrectNetwork(isCorrectChain)

      if (!isCorrectChain) {
        await switchToAvalancheTestnet()
      }

      toast({
        title: "Wallet connected",
        description: "Your wallet has been connected successfully",
      })
    } catch (error: any) {
      console.error("Error connecting wallet:", error)
      toast({
        title: "Connection failed",
        description: error.message || "Failed to connect wallet",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const switchToAvalancheTestnet = async () => {
    if (typeof window === "undefined" || !window.ethereum) return

    try {
      // Try to switch to Avalanche Testnet
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: AVALANCHE_TESTNET_PARAMS.chainId }],
      })
      setIsCorrectNetwork(true)
    } catch (switchError: any) {
      // This error code indicates that the chain has not been added to MetaMask
      if (switchError.code === 4902) {
        try {
          await window.ethereum.request({
            method: "wallet_addEthereumChain",
            params: [AVALANCHE_TESTNET_PARAMS],
          })
          setIsCorrectNetwork(true)
        } catch (addError) {
          console.error("Error adding Avalanche Testnet:", addError)
          toast({
            title: "Network error",
            description: "Failed to add Avalanche Testnet to your wallet",
            variant: "destructive",
          })
        }
      } else {
        console.error("Error switching to Avalanche Testnet:", switchError)
        toast({
          title: "Network error",
          description: "Failed to switch to Avalanche Testnet",
          variant: "destructive",
        })
      }
    }
  }

  const disconnectWallet = () => {
    setIsConnected(false)
    setWalletAddress("")
    setProvider(null)
    setIsCorrectNetwork(false)
    setIsDialogOpen(false)

    toast({
      title: "Wallet disconnected",
      description: "Your wallet has been disconnected",
    })
  }

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button
          variant={isConnected ? "outline" : "default"}
          className={cn(
            isConnected && isCorrectNetwork && "border-green-500",
            isConnected && !isCorrectNetwork && "border-yellow-500",
          )}
        >
          <Wallet className="mr-2 h-4 w-4" />
          {isConnected
            ? isCorrectNetwork
              ? `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}`
              : "Wrong Network"
            : "Connect Wallet"}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{isConnected ? "Wallet Connected" : "Connect Your Wallet"}</DialogTitle>
          <DialogDescription>
            {isConnected
              ? "Your wallet is connected to AvaSend."
              : "Connect your Avalanche-compatible wallet to use AvaSend."}
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-4 py-4">
          {isConnected ? (
            <>
              <div className="flex flex-col gap-2 rounded-lg border p-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Wallet Address</span>
                  <span className={`text-xs ${isCorrectNetwork ? "text-green-500" : "text-yellow-500"}`}>
                    {isCorrectNetwork ? "Avalanche Fuji Testnet" : "Wrong Network"}
                  </span>
                </div>
                <code className="rounded bg-muted px-2 py-1 text-sm">{walletAddress}</code>
              </div>

              {!isCorrectNetwork && (
                <Button onClick={switchToAvalancheTestnet} className="w-full">
                  Switch to Avalanche Testnet
                </Button>
              )}

              <Button variant="destructive" onClick={disconnectWallet}>
                Disconnect Wallet
              </Button>
            </>
          ) : (
            <div className="grid gap-4">
              <Button onClick={connectWallet} disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Connecting...
                  </>
                ) : (
                  <>
                    <Wallet className="mr-2 h-4 w-4" />
                    Connect MetaMask
                  </>
                )}
              </Button>
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">Note</span>
                </div>
              </div>
              <p className="text-xs text-muted-foreground text-center">
                AvaSend runs on Avalanche Fuji Testnet. Make sure your wallet is configured for this network.
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
