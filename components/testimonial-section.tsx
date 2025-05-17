"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { ChevronLeft, ChevronRight, Quote } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export function TestimonialSection() {
  const [mounted, setMounted] = useState(false)
  const [activeIndex, setActiveIndex] = useState(0)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  const testimonials = [
    {
      quote:
        "AvaSend has transformed how I send money to my family in Kenya. The instant transfers and automatic cash-out to M-Pesa have made the process seamless and affordable.",
      author: "James Mwangi",
      title: "Kenyan Diaspora, USA",
      avatar: "/placeholder.svg?height=80&width=80",
    },
    {
      quote:
        "As a judge in the Avalanche Hackathon, I was impressed by AvaSend's innovative approach to cross-border payments. The integration with mobile money services is a game-changer.",
      author: "Sarah Johnson",
      title: "Blockchain Expert, Avalanche Foundation",
      avatar: "/placeholder.svg?height=80&width=80",
    },
    {
      quote:
        "The virtual debit cards feature is brilliant. I can now spend my crypto online without having to go through the hassle of converting it to fiat first.",
      author: "David Kimani",
      title: "Tech Entrepreneur, Rwanda",
      avatar: "/placeholder.svg?height=80&width=80",
    },
  ]

  const nextTestimonial = () => {
    setActiveIndex((prev) => (prev + 1) % testimonials.length)
  }

  const prevTestimonial = () => {
    setActiveIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length)
  }

  return (
    <section className="w-full py-12 md:py-24 lg:py-32">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <div className="inline-block rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
              Testimonials
            </div>
            <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">What People Are Saying</h2>
            <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl/relaxed">
              Hear from our users and industry experts about how AvaSend is changing the remittance landscape.
            </p>
          </div>
        </div>
        <div className="mx-auto max-w-4xl mt-16 relative">
          <motion.div
            key={activeIndex}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="border-none shadow-lg bg-primary/5">
              <CardContent className="p-8 md:p-12">
                <div className="flex flex-col items-center text-center space-y-4">
                  <Quote className="h-12 w-12 text-primary/40" />
                  <p className="text-xl md:text-2xl font-medium leading-relaxed">"{testimonials[activeIndex].quote}"</p>
                  <div className="flex flex-col items-center pt-4">
                    <img
                      src={testimonials[activeIndex].avatar || "/placeholder.svg"}
                      alt={testimonials[activeIndex].author}
                      className="w-16 h-16 rounded-full object-cover mb-2"
                    />
                    <h3 className="font-semibold">{testimonials[activeIndex].author}</h3>
                    <p className="text-sm text-muted-foreground">{testimonials[activeIndex].title}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
          <div className="flex justify-center mt-8 space-x-2">
            <Button variant="outline" size="icon" onClick={prevTestimonial} className="rounded-full">
              <ChevronLeft className="h-4 w-4" />
              <span className="sr-only">Previous</span>
            </Button>
            {testimonials.map((_, index) => (
              <Button
                key={index}
                variant="ghost"
                size="sm"
                onClick={() => setActiveIndex(index)}
                className={`w-2 h-2 p-0 rounded-full ${index === activeIndex ? "bg-primary" : "bg-muted"}`}
              >
                <span className="sr-only">Testimonial {index + 1}</span>
              </Button>
            ))}
            <Button variant="outline" size="icon" onClick={nextTestimonial} className="rounded-full">
              <ChevronRight className="h-4 w-4" />
              <span className="sr-only">Next</span>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
