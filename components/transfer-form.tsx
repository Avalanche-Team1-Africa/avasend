"use client"

import type React from "react"

import { useState } from "react"
import { ArrowRight, Check, ChevronsUpDown, Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { cn } from "@/lib/utils"
import { useWallet } from "@/components/wallet-provider"
import { useToast } from "@/hooks/use-toast"
import { sendMobileMoneyPayment } from "@/lib/intasend"
import { WalletConnect } from "@/components/wallet-connect"

const mobileProviders = [
  { value: "mpesa", label: "M-Pesa" },
  { value: "airtel", label: "Airtel Money" },
]

const countries = [
  { value: "ke", label: "Kenya" },
  { value: "ug", label: "Uganda" },
  { value: "tz", label: "Tanzania" },
  { value: "rw", label: "Rwanda" },
]

export function TransferForm() {
  const { isConnected, walletAddress, usdcBalance, usdcContract, refreshBalance } = useWallet()
  const [amount, setAmount] = useState("")
  const [phoneNumber, setPhoneNumber] = useState("")
  const [provider, setProvider] = useState("mpesa")
  const [open, setOpen] = useState(false)
  const [country, setCountry] = useState(countries[0])
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!isConnected) {
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your wallet to send money",
        variant: "destructive",
      })
      return
    }

    if (!usdcContract) {
      toast({
        title: "Contract Not Available",
        description: "USDC contract is not available",
        variant: "destructive",
      })
      return
    }

    if (!amount || Number.parseFloat(amount) <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid amount",
        variant: "destructive",
      })
      return
    }

    if (!phoneNumber) {
      toast({
        title: "Invalid Phone Number",
        description: "Please enter a valid phone number",
        variant: "destructive",
      })
      return
    }

    if (Number.parseFloat(amount) > Number.parseFloat(usdcBalance)) {
      toast({
        title: "Insufficient Balance",
        description: "You don't have enough USDC",
        variant: "destructive",
      })
      return
    }

    setLoading(true)

    try {
      // 1. First, we need to approve the contract to spend USDC
      // This would typically be a backend contract address that handles the transfer
      // For this MVP, we'll simulate this part

      // 2. Call the IntaSend API to initiate mobile money payment
      const paymentResult = await sendMobileMoneyPayment({
        amount: Number.parseFloat(amount),
        phone_number: phoneNumber,
        provider: provider,
        country_code: country.value,
      })

      if (paymentResult.success) {
        // 3. Update the UI
        setSuccess(true)
        toast({
          title: "Transfer Successful",
          description: `${amount} USDC sent to ${phoneNumber}`,
        })

        // 4. Refresh the balance
        await refreshBalance()

        // Reset form after 3 seconds
        setTimeout(() => {
          setSuccess(false)
          setAmount("")
          setPhoneNumber("")
        }, 3000)
      } else {
        throw new Error(paymentResult.message || "Payment failed")
      }
    } catch (error: any) {
      console.error("Transfer error:", error)
      toast({
        title: "Transfer Failed",
        description: error.message || "Failed to send money. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Send Money</CardTitle>
        <CardDescription>Send USDC to any mobile money wallet in East Africa.</CardDescription>
      </CardHeader>
      <CardContent>
        {!isConnected ? (
          <div className="flex flex-col items-center justify-center gap-4 py-8">
            <p className="text-center text-muted-foreground">Connect your wallet to send money</p>
            <WalletConnect />
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="grid gap-6">
            <div className="grid gap-2">
              <Label htmlFor="amount">Amount (USDC)</Label>
              <Input
                id="amount"
                type="number"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
              />
              <p className="text-xs text-muted-foreground">
                Available balance: {Number.parseFloat(usdcBalance).toFixed(2)} USDC
              </p>
            </div>
            <div className="grid gap-2">
              <Label>Recipient Country</Label>
              <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                  <Button variant="outline" role="combobox" aria-expanded={open} className="justify-between">
                    {country.label}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0">
                  <Command>
                    <CommandInput placeholder="Search country..." />
                    <CommandList>
                      <CommandEmpty>No country found.</CommandEmpty>
                      <CommandGroup>
                        {countries.map((c) => (
                          <CommandItem
                            key={c.value}
                            value={c.value}
                            onSelect={() => {
                              setCountry(c)
                              setOpen(false)
                            }}
                          >
                            <Check
                              className={cn("mr-2 h-4 w-4", country.value === c.value ? "opacity-100" : "opacity-0")}
                            />
                            {c.label}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="phone">Recipient Phone Number</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="+254 7XX XXX XXX"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label>Mobile Money Provider</Label>
              <RadioGroup value={provider} onValueChange={setProvider} className="grid grid-cols-2 gap-4">
                {mobileProviders.map((p) => (
                  <div key={p.value}>
                    <RadioGroupItem value={p.value} id={p.value} className="peer sr-only" />
                    <Label
                      htmlFor={p.value}
                      className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                    >
                      <img
                        src={`/placeholder.svg?height=24&width=24&text=${p.label}`}
                        alt={p.label}
                        className="mb-3 h-6 w-6"
                      />
                      {p.label}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
          </form>
        )}
      </CardContent>
      <CardFooter>
        <Button
          onClick={handleSubmit}
          disabled={loading || success || !isConnected || !amount || !phoneNumber}
          className="w-full"
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : success ? (
            <>
              <Check className="mr-2 h-4 w-4" />
              Sent Successfully!
            </>
          ) : (
            <>
              Send Money <ArrowRight className="ml-2 h-4 w-4" />
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  )
}
