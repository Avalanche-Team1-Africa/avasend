"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { DollarSign, Users, Zap } from "lucide-react"

export function StatsSection() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  const stats = [
    {
      icon: <DollarSign className="h-5 w-5 text-primary" />,
      value: "$1.2M+",
      label: "Total Volume",
      description: "Processed in testnet transactions",
    },
    {
      icon: <Users className="h-5 w-5 text-primary" />,
      value: "5,000+",
      label: "Active Users",
      description: "Across 4 African countries",
    },
    {
      icon: <Zap className="h-5 w-5 text-primary" />,
      value: "<5s",
      label: "Average Transfer Time",
      description: "From wallet to mobile money",
    },
  ]

  return (
    <section className="w-full py-12 md:py-16 border-y">
      <div className="container px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="flex flex-col items-center text-center space-y-2"
            >
              <div className="flex items-center justify-center h-12 w-12 rounded-full bg-primary/10">{stat.icon}</div>
              <h3 className="text-3xl font-bold">{stat.value}</h3>
              <p className="font-medium">{stat.label}</p>
              <p className="text-sm text-muted-foreground">{stat.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
