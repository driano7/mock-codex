"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { ArrowLeft, Send, Plus, Check, CheckCheck, Clock, DollarSign } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"

interface Message {
  id: string
  content: string
  sender: "me" | "other"
  timestamp: Date
  status: "sending" | "sent" | "delivered" | "read"
  type: "text" | "transaction"
  transactionData?: {
    amount: string
    token: string
    hash: string
    recipient: string
  }
}

interface ChatInterfaceProps {
  contact: {
    id: string
    name: string
    avatar: string
    address: string
    isOnline: boolean
  }
  onBack: () => void
}

const renderMarkdown = (text: string) => {
  // Simple markdown parser for basic formatting
  const html = text
    // Bold: **text** or __text__
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/__(.*?)__/g, "<strong>$1</strong>")
    // Italic: *text* or _text_
    .replace(/\*(.*?)\*/g, "<em>$1</em>")
    .replace(/_(.*?)_/g, "<em>$1</em>")
    // Code: `text`
    .replace(/`(.*?)`/g, '<code class="bg-muted px-1 py-0.5 rounded text-sm font-mono">$1</code>')
    // Line breaks
    .replace(/\n/g, "<br>")

  return { __html: html }
}

export function ChatInterface({ contact, onBack }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content: "Hey! How are you doing?",
      sender: "other",
      timestamp: new Date(Date.now() - 3600000),
      status: "read",
      type: "text",
    },
    {
      id: "2",
      content: "I'm doing great! Just sent you some ETH for the dinner we had yesterday",
      sender: "me",
      timestamp: new Date(Date.now() - 3000000),
      status: "read",
      type: "text",
    },
    {
      id: "3",
      content: "",
      sender: "me",
      timestamp: new Date(Date.now() - 2900000),
      status: "read",
      type: "transaction",
      transactionData: {
        amount: "0.5",
        token: "ETH",
        hash: "0x742d35Cc6634C0532925a3b8D4C9db96590b5b8c",
        recipient: contact.address,
      },
    },
    {
      id: "4",
      content: "Thanks! Received it. You're the best! 🙏",
      sender: "other",
      timestamp: new Date(Date.now() - 1800000),
      status: "read",
      type: "text",
    },
  ])

  const [newMessage, setNewMessage] = useState("")
  const [showSendCrypto, setShowSendCrypto] = useState(false)
  const [selectedToken, setSelectedToken] = useState("")
  const [amount, setAmount] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const { toast } = useToast()

  const tokens = [
    { symbol: "ETH", name: "Ethereum", balance: 2.45 },
    { symbol: "USDC", name: "USD Coin", balance: 1250.0 },
    { symbol: "BTC", name: "Bitcoin", balance: 0.15 },
  ]

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("es-ES", {
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const formatDate = (date: Date) => {
    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)

    if (date.toDateString() === today.toDateString()) {
      return "Hoy"
    } else if (date.toDateString() === yesterday.toDateString()) {
      return "Ayer"
    } else {
      return date.toLocaleDateString("es-ES", {
        day: "numeric",
        month: "short",
      })
    }
  }

  const getStatusIcon = (status: Message["status"]) => {
    switch (status) {
      case "sending":
        return <Clock className="w-3 h-3 text-muted-foreground" />
      case "sent":
        return <Check className="w-3 h-3 text-muted-foreground" />
      case "delivered":
        return <CheckCheck className="w-3 h-3 text-muted-foreground" />
      case "read":
        return <CheckCheck className="w-3 h-3 text-primary" />
    }
  }

  const sendMessage = () => {
    if (!newMessage.trim()) return

    const message: Message = {
      id: Date.now().toString(),
      content: newMessage,
      sender: "me",
      timestamp: new Date(),
      status: "sending",
      type: "text",
    }

    setMessages((prev) => [...prev, message])
    setNewMessage("")

    // Simulate message delivery
    setTimeout(() => {
      setMessages((prev) => prev.map((msg) => (msg.id === message.id ? { ...msg, status: "sent" } : msg)))
    }, 1000)

    setTimeout(() => {
      setMessages((prev) => prev.map((msg) => (msg.id === message.id ? { ...msg, status: "delivered" } : msg)))
    }, 2000)

    setTimeout(() => {
      setMessages((prev) => prev.map((msg) => (msg.id === message.id ? { ...msg, status: "read" } : msg)))
    }, 3000)
  }

  const sendCrypto = () => {
    if (!selectedToken || !amount) {
      toast({
        title: "Error",
        description: "Por favor completa todos los campos",
        variant: "destructive",
      })
      return
    }

    const transactionMessage: Message = {
      id: Date.now().toString(),
      content: "",
      sender: "me",
      timestamp: new Date(),
      status: "sending",
      type: "transaction",
      transactionData: {
        amount,
        token: selectedToken,
        hash: `0x${Math.random().toString(16).substr(2, 40)}`,
        recipient: contact.address,
      },
    }

    setMessages((prev) => [...prev, transactionMessage])
    setShowSendCrypto(false)
    setSelectedToken("")
    setAmount("")

    toast({
      title: "Transacción enviada",
      description: `${amount} ${selectedToken} enviado a ${contact.name}`,
    })

    // Simulate transaction confirmation
    setTimeout(() => {
      setMessages((prev) => prev.map((msg) => (msg.id === transactionMessage.id ? { ...msg, status: "sent" } : msg)))
    }, 2000)

    setTimeout(() => {
      setMessages((prev) =>
        prev.map((msg) => (msg.id === transactionMessage.id ? { ...msg, status: "delivered" } : msg)),
      )
    }, 4000)

    setTimeout(() => {
      setMessages((prev) => prev.map((msg) => (msg.id === transactionMessage.id ? { ...msg, status: "read" } : msg)))
    }, 6000)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  // Group messages by date
  const groupedMessages = messages.reduce((groups: { [key: string]: Message[] }, message) => {
    const date = formatDate(message.timestamp)
    if (!groups[date]) {
      groups[date] = []
    }
    groups[date].push(message)
    return groups
  }, {})

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header */}
      <div className="flex items-center p-4 border-b border-border bg-card">
        <Button variant="ghost" size="sm" onClick={onBack} className="mr-3">
          <ArrowLeft className="w-4 h-4" />
        </Button>

        <div className="flex items-center space-x-3 flex-1">
          <div className="relative">
            <Avatar>
              <AvatarImage src={contact.avatar || "/placeholder.svg"} />
              <AvatarFallback>{contact.name.charAt(0)}</AvatarFallback>
            </Avatar>
            {contact.isOnline && (
              <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-background"></div>
            )}
          </div>

          <div>
            <h2 className="font-semibold text-foreground">{contact.name}</h2>
            <p className="text-xs text-muted-foreground">{contact.isOnline ? "En línea" : "Desconectado"}</p>
          </div>
        </div>

        <Dialog open={showSendCrypto} onOpenChange={setShowSendCrypto}>
          <DialogTrigger asChild>
            <Button size="sm" variant="outline">
              <DollarSign className="w-4 h-4 mr-2" />
              Enviar
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Enviar Cripto a {contact.name}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="token">Token</Label>
                <Select value={selectedToken} onValueChange={setSelectedToken}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar token" />
                  </SelectTrigger>
                  <SelectContent>
                    {tokens.map((token) => (
                      <SelectItem key={token.symbol} value={token.symbol}>
                        {token.symbol} ({token.balance})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="amount">Cantidad</Label>
                <Input
                  id="amount"
                  type="number"
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
              </div>

              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setShowSendCrypto(false)}>
                  Cancelar
                </Button>
                <Button onClick={sendCrypto}>Enviar</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {Object.entries(groupedMessages).map(([date, dateMessages]) => (
          <div key={date}>
            {/* Date Separator */}
            <div className="flex items-center justify-center my-4">
              <div className="bg-muted px-3 py-1 rounded-full text-xs text-muted-foreground">{date}</div>
            </div>

            {/* Messages for this date */}
            <div className="space-y-3">
              {dateMessages.map((message, index) => (
                <div
                  key={message.id}
                  className={cn(
                    "flex items-end space-x-2 animate-in slide-in-from-bottom-2 duration-300",
                    message.sender === "me" ? "justify-end" : "justify-start",
                  )}
                >
                  {message.sender === "other" && (
                    <Avatar className="w-6 h-6">
                      <AvatarImage src={contact.avatar || "/placeholder.svg"} />
                      <AvatarFallback className="text-xs">{contact.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                  )}

                  <div className={cn("max-w-xs lg:max-w-md", message.sender === "me" ? "order-1" : "order-2")}>
                    {message.type === "text" ? (
                      <div
                        className={cn(
                          "px-4 py-2 rounded-2xl",
                          message.sender === "me"
                            ? "bg-primary text-primary-foreground rounded-br-md"
                            : "bg-muted text-foreground rounded-bl-md",
                        )}
                      >
                        <div
                          className="text-sm [&>strong]:font-bold [&>em]:italic [&>code]:bg-black/20 [&>code]:px-1 [&>code]:py-0.5 [&>code]:rounded [&>code]:text-xs [&>code]:font-mono"
                          dangerouslySetInnerHTML={renderMarkdown(message.content)}
                        />
                      </div>
                    ) : (
                      <Card className="border-primary/20 bg-primary/5">
                        <CardContent className="p-3">
                          <div className="flex items-center space-x-2 mb-2">
                            <div className="w-6 h-6 bg-primary/20 rounded-full flex items-center justify-center">
                              <DollarSign className="w-3 h-3 text-primary" />
                            </div>
                            <span className="text-xs font-medium text-muted-foreground">Transacción de Cripto</span>
                          </div>
                          <div className="space-y-1">
                            <p className="font-semibold text-foreground">
                              {message.transactionData?.amount} {message.transactionData?.token}
                            </p>
                            <p className="text-xs text-muted-foreground">Para: {contact.name}</p>
                            <p className="text-xs font-mono text-muted-foreground truncate">
                              {message.transactionData?.hash}
                            </p>
                          </div>
                        </CardContent>
                      </Card>
                    )}

                    <div
                      className={cn(
                        "flex items-center space-x-1 mt-1 text-xs text-muted-foreground",
                        message.sender === "me" ? "justify-end" : "justify-start",
                      )}
                    >
                      <span>{formatTime(message.timestamp)}</span>
                      {message.sender === "me" && getStatusIcon(message.status)}
                    </div>
                  </div>

                  {message.sender === "me" && (
                    <Avatar className="w-6 h-6">
                      <AvatarImage src="/placeholder.svg?height=24&width=24" />
                      <AvatarFallback className="text-xs">Tú</AvatarFallback>
                    </Avatar>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="p-4 border-t border-border bg-card">
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="sm" onClick={() => setShowSendCrypto(true)} className="flex-shrink-0">
            <Plus className="w-4 h-4" />
          </Button>

          <Input
            placeholder="Escribe un mensaje..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            className="flex-1"
          />

          <Button onClick={sendMessage} disabled={!newMessage.trim()} size="sm" className="flex-shrink-0">
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
