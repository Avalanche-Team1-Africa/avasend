"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { ethers } from "ethers"
import { useToast } from "@/hooks/use-toast"

// ABI for ERC20 token (USDC)
const ERC20_ABI = [
  "function balanceOf(address owner) view returns (uint256)",
  "function decimals() view returns (uint8)",
  "function symbol() view returns (string)",
  "function transfer(address to, uint amount) returns (bool)",
  "function allowance(address owner, address spender) view returns (uint256)",
  "function approve(address spender, uint256 amount) returns (bool)",
  "event Transfer(address indexed from, address indexed to, uint amount)",
]

// Avalanche Fuji Testnet USDC contract address (this is a mock address, replace with actual testnet USDC)
const USDC_CONTRACT_ADDRESS = "0x5425890298aed601595a70AB815c96711a31Bc65" // Mock address, replace with actual testnet USDC

type WalletContextType = {
  isConnected: boolean
  walletAddress: string
  usdcBalance: string
  provider: ethers.BrowserProvider | null
  signer: ethers.Signer | null
  usdcContract: ethers.Contract | null
  connectWallet: () => Promise<void>
  disconnectWallet: () => void
  refreshBalance: () => Promise<void>
}

const WalletContext = createContext<WalletContextType | undefined>(undefined)

export function WalletProvider({ children }: { children: ReactNode }) {
  const [isConnected, setIsConnected] = useState(false)
  const [walletAddress, setWalletAddress] = useState("")
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null)
  const [signer, setSigner] = useState<ethers.Signer | null>(null)
  const [usdcContract, setUsdcContract] = useState<ethers.Contract | null>(null)
  const [usdcBalance, setUsdcBalance] = useState("0")
  const { toast } = useToast()

  // Check if wallet is already connected
  useEffect(() => {
    const checkConnection = async () => {
      if (window.ethereum) {
        try {
          const accounts = await window.ethereum.request({ method: "eth_accounts" })
          if (accounts.length > 0) {
            const newProvider = new ethers.BrowserProvider(window.ethereum)
            const newSigner = await newProvider.getSigner()
            const address = await newSigner.getAddress()

            setProvider(newProvider)
            setSigner(newSigner)
            setWalletAddress(address)
            setIsConnected(true)

            // Get network to ensure we're on Fuji testnet
            const network = await newProvider.getNetwork()
            if (network.chainId !== 43113n) {
              // Fuji testnet chainId
              toast({
                title: "Wrong Network",
                description: "Please connect to Avalanche Fuji Testnet",
                variant: "destructive",
              })
            } else {
              const contract = new ethers.Contract(USDC_CONTRACT_ADDRESS, ERC20_ABI, newProvider)
              setUsdcContract(contract)
              fetchUsdcBalance(newProvider, address)
            }
          }
        } catch (error) {
          console.error("Error checking connection:", error)
        }
      }
    }

    checkConnection()

    // Listen for account changes
    if (window.ethereum) {
      window.ethereum.on("accountsChanged", (accounts: string[]) => {
        if (accounts.length === 0) {
          setIsConnected(false)
          setWalletAddress("")
          setSigner(null)
          setUsdcContract(null)
        } else {
          setWalletAddress(accounts[0])
          if (provider) {
            fetchUsdcBalance(provider, accounts[0])
          }
        }
      })

      // Listen for chain changes
      window.ethereum.on("chainChanged", () => {
        window.location.reload()
      })
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeAllListeners()
      }
    }
  }, [toast])

  const fetchUsdcBalance = async (provider: ethers.BrowserProvider, address: string) => {
    try {
      const usdcContract = new ethers.Contract(USDC_CONTRACT_ADDRESS, ERC20_ABI, provider)
      const balance = await usdcContract.balanceOf(address)
      const decimals = await usdcContract.decimals()

      // Format balance with proper decimals
      const formattedBalance = ethers.formatUnits(balance, decimals)
      setUsdcBalance(formattedBalance)
    } catch (error) {
      console.error("Error fetching USDC balance:", error)
      setUsdcBalance("0")
    }
  }

  const refreshBalance = async () => {
    if (provider && walletAddress) {
      await fetchUsdcBalance(provider, walletAddress)
    }
  }

  const connectWallet = async () => {
    if (!window.ethereum) {
      toast({
        title: "No Wallet Detected",
        description: "Please install MetaMask or another Ethereum wallet",
        variant: "destructive",
      })
      return
    }

    try {
      // Request account access
      const accounts = await window.ethereum.request({ method: "eth_requestAccounts" })

      // Create provider and signer
      const newProvider = new ethers.BrowserProvider(window.ethereum)
      const newSigner = await newProvider.getSigner()
      const address = await newSigner.getAddress()

      setProvider(newProvider)
      setSigner(newSigner)
      setWalletAddress(address)
      setIsConnected(true)

      // Check if we're on the right network (Avalanche Fuji Testnet)
      const network = await newProvider.getNetwork()
      if (network.chainId !== 43113n) {
        // Fuji testnet chainId
        try {
          // Try to switch to Fuji testnet
          await window.ethereum.request({
            method: "wallet_switchEthereumChain",
            params: [{ chainId: "0xA869" }], // 0xA869 is hex for 43113
          })
        } catch (switchError: any) {
          // If the network is not added, add it
          if (switchError.code === 4902) {
            try {
              await window.ethereum.request({
                method: "wallet_addEthereumChain",
                params: [
                  {
                    chainId: "0xA869",
                    chainName: "Avalanche Fuji Testnet",
                    nativeCurrency: {
                      name: "AVAX",
                      symbol: "AVAX",
                      decimals: 18,
                    },
                    rpcUrls: ["https://api.avax-test.network/ext/bc/C/rpc"],
                    blockExplorerUrls: ["https://testnet.snowtrace.io/"],
                  },
                ],
              })
            } catch (addError) {
              console.error("Error adding Fuji network:", addError)
            }
          }
        }
      }

      // Create USDC contract instance
      const contract = new ethers.Contract(USDC_CONTRACT_ADDRESS, ERC20_ABI, newSigner)
      setUsdcContract(contract)

      // Fetch USDC balance
      fetchUsdcBalance(newProvider, address)
    } catch (error) {
      console.error("Error connecting wallet:", error)
      toast({
        title: "Connection Failed",
        description: "Failed to connect wallet. Please try again.",
        variant: "destructive",
      })
    }
  }

  const disconnectWallet = () => {
    setIsConnected(false)
    setWalletAddress("")
    setSigner(null)
    setProvider(null)
    setUsdcContract(null)
    setUsdcBalance("0")
  }

  return (
    <WalletContext.Provider
      value={{
        isConnected,
        walletAddress,
        usdcBalance,
        provider,
        signer,
        usdcContract,
        connectWallet,
        disconnectWallet,
        refreshBalance,
      }}
    >
      {children}
    </WalletContext.Provider>
  )
}

export function useWallet() {
  const context = useContext(WalletContext)
  if (context === undefined) {
    throw new Error("useWallet must be used within a WalletProvider")
  }
  return context
}
