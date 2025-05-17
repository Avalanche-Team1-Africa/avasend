"use client"

import { useEffect, useState } from "react"
import { ArrowUpRight, CreditCard, Search } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { useWallet } from "@/components/wallet-provider"
import { WalletConnect } from "@/components/wallet-connect"

// Transaction type
type Transaction = {
  id: string
  type: "send" | "card"
  amount: string
  recipient: string
  provider: string
  status: "pending" | "completed" | "failed"
  date: string
}

export function TransactionHistory() {
  const { isConnected, walletAddress } = useWallet()
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  // Fetch transactions when wallet is connected
  useEffect(() => {
    if (isConnected && walletAddress) {
      fetchTransactions()
    } else {
      setTransactions([])
    }
  }, [isConnected, walletAddress])

  const fetchTransactions = async () => {
    setLoading(true)

    try {
      // In a real implementation, this would fetch transactions from a backend API
      // For this MVP, we'll use mock data

      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Mock transaction data
      const mockTransactions: Transaction[] = [
        {
          id: "TX123456",
          type: "send",
          amount: "250.00",
          recipient: "+254 712 345 678",
          provider: "M-Pesa",
          status: "completed",
          date: "2025-05-16T10:30:00Z",
        },
        {
          id: "TX123455",
          type: "send",
          amount: "100.00",
          recipient: "+256 775 123 456",
          provider: "Airtel Money",
          status: "completed",
          date: "2025-05-15T14:20:00Z",
        },
        {
          id: "TX123454",
          type: "card",
          amount: "75.50",
          recipient: "Amazon.com",
          provider: "Virtual Card",
          status: "completed",
          date: "2025-05-14T09:15:00Z",
        },
        {
          id: "TX123453",
          type: "send",
          amount: "500.00",
          recipient: "+254 722 987 654",
          provider: "M-Pesa",
          status: "pending",
          date: "2025-05-12T16:45:00Z",
        },
        {
          id: "TX123452",
          type: "card",
          amount: "120.00",
          recipient: "Netflix",
          provider: "Virtual Card",
          status: "completed",
          date: "2025-05-10T11:30:00Z",
        },
      ]

      setTransactions(mockTransactions)
    } catch (error) {
      console.error("Error fetching transactions:", error)
    } finally {
      setLoading(false)
    }
  }

  // Filter transactions based on search query
  const filteredTransactions = transactions.filter(
    (tx) =>
      tx.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tx.recipient.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tx.provider.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <Card>
      <CardHeader>
        <CardTitle>Transaction History</CardTitle>
        <CardDescription>View all your recent transactions.</CardDescription>
      </CardHeader>
      <CardContent>
        {!isConnected ? (
          <div className="flex flex-col items-center justify-center gap-4 py-8">
            <p className="text-center text-muted-foreground">Connect your wallet to view transaction history</p>
            <WalletConnect />
          </div>
        ) : (
          <>
            <div className="flex items-center gap-4 mb-4">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search transactions..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button variant="outline" size="sm">
                Export
              </Button>
            </div>
            {loading ? (
              <div className="flex justify-center py-8">
                <p className="text-muted-foreground">Loading transactions...</p>
              </div>
            ) : filteredTransactions.length === 0 ? (
              <div className="flex justify-center py-8">
                <p className="text-muted-foreground">No transactions found</p>
              </div>
            ) : (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Transaction</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead className="hidden md:table-cell">Recipient</TableHead>
                      <TableHead className="hidden md:table-cell">Provider</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="hidden md:table-cell">Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredTransactions.map((transaction) => (
                      <TableRow key={transaction.id}>
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-2">
                            <div
                              className={`rounded-full p-1 ${transaction.type === "send" ? "bg-orange-100" : "bg-blue-100"}`}
                            >
                              {transaction.type === "send" ? (
                                <ArrowUpRight className="h-4 w-4 text-orange-600" />
                              ) : (
                                <CreditCard className="h-4 w-4 text-blue-600" />
                              )}
                            </div>
                            <span className="hidden md:inline">{transaction.id}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="font-medium">{transaction.amount} USDC</div>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">{transaction.recipient}</TableCell>
                        <TableCell className="hidden md:table-cell">{transaction.provider}</TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              transaction.status === "completed"
                                ? "default"
                                : transaction.status === "pending"
                                  ? "outline"
                                  : "destructive"
                            }
                          >
                            {transaction.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          {new Date(transaction.date).toLocaleDateString()}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  )
}
