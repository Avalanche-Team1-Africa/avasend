"use client"

import { useState, useEffect } from "react"
import { CreditCard, Loader2, Plus } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { useWallet } from "@/components/wallet-provider"
import { useToast } from "@/hooks/use-toast"
import { WalletConnect } from "@/components/wallet-connect"
import { createVirtualCard } from "@/lib/stripe"

// Card type
type VirtualCard = {
  id: string
  name: string
  last4: string
  expMonth: string
  expYear: string
  balance: string
  active: boolean
}

export function VirtualCards() {
  const { isConnected, walletAddress, usdcBalance, refreshBalance } = useWallet()
  const [isCreating, setIsCreating] = useState(false)
  const [newCardName, setNewCardName] = useState("")
  const [newCardAmount, setNewCardAmount] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [cards, setCards] = useState<VirtualCard[]>([])
  const [loadingCards, setLoadingCards] = useState(false)
  const { toast } = useToast()

  // Fetch cards when wallet is connected
  useEffect(() => {
    if (isConnected && walletAddress) {
      fetchCards()
    } else {
      setCards([])
    }
  }, [isConnected, walletAddress])

  const fetchCards = async () => {
    setLoadingCards(true)

    try {
      // In a real implementation, this would fetch cards from a backend API
      // For this MVP, we'll use mock data

      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Mock card data
      const mockCards: VirtualCard[] = [
        {
          id: "card_1",
          name: "Shopping Card",
          last4: "4242",
          expMonth: "12",
          expYear: "28",
          balance: "500.00",
          active: true,
        },
        {
          id: "card_2",
          name: "Subscription Card",
          last4: "5678",
          expMonth: "09",
          expYear: "27",
          balance: "250.00",
          active: true,
        },
      ]

      setCards(mockCards)
    } catch (error) {
      console.error("Error fetching cards:", error)
    } finally {
      setLoadingCards(false)
    }
  }

  const handleCreateCard = async () => {
    if (!isConnected) {
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your wallet to create a card",
        variant: "destructive",
      })
      return
    }

    if (!newCardName) {
      toast({
        title: "Invalid Card Name",
        description: "Please enter a valid card name",
        variant: "destructive",
      })
      return
    }

    if (!newCardAmount || Number.parseFloat(newCardAmount) <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid amount",
        variant: "destructive",
      })
      return
    }

    if (Number.parseFloat(newCardAmount) > Number.parseFloat(usdcBalance)) {
      toast({
        title: "Insufficient Balance",
        description: "You don't have enough USDC",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      // Call the Stripe API to create a virtual card
      const cardResult = await createVirtualCard({
        name: newCardName,
        amount: Number.parseFloat(newCardAmount),
        wallet_address: walletAddress,
      })

      if (cardResult.success) {
        // Add the new card to the list
        setCards((prevCards) => [
          ...prevCards,
          {
            id: cardResult.card_id!,
            name: newCardName,
            last4: cardResult.last4!,
            expMonth: cardResult.exp_month!,
            expYear: cardResult.exp_year!,
            balance: newCardAmount,
            active: true,
          },
        ])

        toast({
          title: "Card Created",
          description: `${newCardName} card created successfully`,
        })

        // Refresh the balance
        await refreshBalance()

        // Reset form
        setIsCreating(false)
        setNewCardName("")
        setNewCardAmount("")
      } else {
        throw new Error(cardResult.message || "Card creation failed")
      }
    } catch (error: any) {
      console.error("Card creation error:", error)
      toast({
        title: "Card Creation Failed",
        description: error.message || "Failed to create card. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const toggleCardStatus = async (cardId: string, currentStatus: boolean) => {
    try {
      // In a real implementation, this would call a backend API
      // For this MVP, we'll just update the local state

      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 500))

      // Update the card status
      setCards((prevCards) =>
        prevCards.map((card) => (card.id === cardId ? { ...card, active: !currentStatus } : card)),
      )

      toast({
        title: "Card Updated",
        description: `Card ${currentStatus ? "deactivated" : "activated"} successfully`,
      })
    } catch (error) {
      console.error("Error updating card:", error)
      toast({
        title: "Update Failed",
        description: "Failed to update card status. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="grid gap-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Your Virtual Cards</h2>
        <Dialog open={isCreating} onOpenChange={setIsCreating}>
          <DialogTrigger asChild>
            <Button size="sm" disabled={!isConnected}>
              <Plus className="mr-2 h-4 w-4" />
              New Card
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Virtual Card</DialogTitle>
              <DialogDescription>Create a new Stripe testnet virtual card linked to your wallet.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="card-name">Card Name</Label>
                <Input
                  id="card-name"
                  value={newCardName}
                  onChange={(e) => setNewCardName(e.target.value)}
                  placeholder="e.g., Shopping Card"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="card-amount">Initial Balance (USDC)</Label>
                <Input
                  id="card-amount"
                  type="number"
                  value={newCardAmount}
                  onChange={(e) => setNewCardAmount(e.target.value)}
                  placeholder="0.00"
                />
                <p className="text-xs text-muted-foreground">
                  Available wallet balance: {Number.parseFloat(usdcBalance).toFixed(2)} USDC
                </p>
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleCreateCard} disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  "Create Card"
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {!isConnected ? (
        <div className="flex flex-col items-center justify-center gap-4 py-8">
          <p className="text-center text-muted-foreground">Connect your wallet to manage virtual cards</p>
          <WalletConnect />
        </div>
      ) : loadingCards ? (
        <div className="flex justify-center py-8">
          <p className="text-muted-foreground">Loading cards...</p>
        </div>
      ) : cards.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-4 py-8 border rounded-lg">
          <CreditCard className="h-12 w-12 text-muted-foreground" />
          <div className="text-center">
            <h3 className="font-medium">No Cards Yet</h3>
            <p className="text-sm text-muted-foreground">Create your first virtual card to get started</p>
          </div>
          <Button onClick={() => setIsCreating(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Create Card
          </Button>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {cards.map((card) => (
            <Card key={card.id} className="overflow-hidden">
              <div className="bg-gradient-to-r from-primary to-primary/80 p-6">
                <div className="flex justify-between">
                  <div className="text-white">
                    <p className="text-sm opacity-80">Stripe Testnet</p>
                    <h3 className="font-semibold">{card.name}</h3>
                  </div>
                  <CreditCard className="h-6 w-6 text-white" />
                </div>
                <div className="mt-6 text-white">
                  <p className="text-lg tracking-widest">•••• •••• •••• {card.last4}</p>
                  <div className="mt-2 flex justify-between text-sm">
                    <div>
                      <p className="opacity-80">Expires</p>
                      <p>
                        {card.expMonth}/{card.expYear}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="opacity-80">Balance</p>
                      <p>{card.balance} USDC</p>
                    </div>
                  </div>
                </div>
              </div>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id={`card-active-${card.id}`}
                      checked={card.active}
                      onCheckedChange={() => toggleCardStatus(card.id, card.active)}
                    />
                    <Label htmlFor={`card-active-${card.id}`}>Active</Label>
                  </div>
                  <Button variant="outline" size="sm">
                    Manage
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
