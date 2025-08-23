"use client"

import React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { User, Sparkles } from "lucide-react"
import { DialogClose } from "@radix-ui/react-dialog"


export function UserModal({ isOpen, onUserSetup }) {
  const [name, setName] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!name.trim()) {
      setError("Please enter your name")
      return
    }

    setIsLoading(true)
    setError("")

    try {
      const response = await fetch("/api/generate-username", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: name.trim() }),
      })

      if (!response.ok) {
        throw new Error("Failed to generate username")
      }

      const data = await response.json()

      // Store in localStorage
      localStorage.setItem("userName", name.trim())
      localStorage.setItem("userUsername", data.username)

      onUserSetup(name.trim(), data.username)
    } catch (error) {
      console.error("Error generating username:", error)
      setError("Failed to set up your profile. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={isOpen}>
      <DialogContent className="sm:max-w-md glass-effect border-primary/20 [&>button]:hidden">
        <DialogHeader className="text-center" >
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-gradient-to-br from-primary to-accent rounded-2xl shadow-lg">
              <User className="w-8 h-8 text-primary-foreground" />
            </div>
          </div>
          <DialogTitle className="text-center text-2xl font-serif bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Welcome to AI Reference Assistant
          </DialogTitle>
          <DialogDescription className="text-muted-foreground text-center">
            We need your name to personalize your experience and manage your data effectively.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 mt-6">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm font-medium">
              Your Name
            </Label>
            <Input
              id="name"
              type="text"
              placeholder="Enter your full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="glass-input"
              disabled={isLoading}
            />
          </div>

          {error && <p className="text-sm text-red-500 bg-red-50 dark:bg-red-950/20 p-3 rounded-lg">{error}</p>}

          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-primary-foreground font-medium py-3 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl"
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                Setting up your profile...
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                Continue
              </div>
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
