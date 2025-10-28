"use client"

import { useState } from "react"
import { Search, Plus } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"
import { ChatInterface } from "@/components/chat-interface"

interface Conversation {
  id: string
  name: string
  lastMessage: string
  timestamp: string
  avatar: string
  unread: number
  address: string
  isOnline: boolean
}

export function ConversationsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedChat, setSelectedChat] = useState<Conversation | null>(null)

  const conversations: Conversation[] = [
    {
      id: "1",
      name: "Alice Cooper",
      lastMessage: "Sent you 0.5 ETH",
      timestamp: "2m",
      avatar: "/placeholder.svg?height=40&width=40",
      unread: 2,
      address: "0x742d35Cc6634C0532925a3b8D4C9db96590b5b8c",
      isOnline: true,
    },
    {
      id: "2",
      name: "Bob Wilson",
      lastMessage: "Thanks for the USDC!",
      timestamp: "1h",
      avatar: "/placeholder.svg?height=40&width=40",
      unread: 0,
      address: "bob.eth",
      isOnline: false,
    },
    {
      id: "3",
      name: "Crypto Group",
      lastMessage: "New DeFi protocol launched",
      timestamp: "3h",
      avatar: "/placeholder.svg?height=40&width=40",
      unread: 5,
      address: "0x8ba1f109551bD432803012645Hac136c22C501e3",
      isOnline: true,
    },
  ]

  const filteredConversations = conversations.filter((conv) =>
    conv.name.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  if (selectedChat) {
    return <ChatInterface contact={selectedChat} onBack={() => setSelectedChat(null)} />
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-foreground">Conversaciones</h1>
          <Button size="sm">
            <Plus className="w-4 h-4 mr-2" />
            Nuevo Chat
          </Button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Buscar contactos..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Conversations List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {filteredConversations.map((conversation) => (
          <Card
            key={conversation.id}
            className="cursor-pointer hover:bg-muted/50 transition-colors"
            onClick={() => setSelectedChat(conversation)}
          >
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <Avatar>
                    <AvatarImage src={conversation.avatar || "/placeholder.svg"} />
                    <AvatarFallback>{conversation.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  {conversation.isOnline && (
                    <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-background"></div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-foreground truncate">{conversation.name}</h3>
                    <span className="text-xs text-muted-foreground">{conversation.timestamp}</span>
                  </div>

                  <p className="text-sm text-muted-foreground truncate">{conversation.lastMessage}</p>
                </div>

                {conversation.unread > 0 && (
                  <div className="bg-primary text-primary-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {conversation.unread}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
