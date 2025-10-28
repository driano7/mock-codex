"use client"

import { useState } from "react"
import { Search, Plus, MessageCircle, Send, Edit, Trash2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { AddContactModal } from "@/components/add-contact-modal"
import { useToast } from "@/hooks/use-toast"

interface Contact {
  id: string
  name: string
  address: string
  avatar: string
  isOnline: boolean
}

export function ContactsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [showAddModal, setShowAddModal] = useState(false)
  const [contacts, setContacts] = useState<Contact[]>([
    {
      id: "1",
      name: "Alice Cooper",
      address: "0x742d35Cc6634C0532925a3b8D4C9db96590b5b8c",
      avatar: "/placeholder.svg?height=40&width=40",
      isOnline: true,
    },
    {
      id: "2",
      name: "Bob Wilson",
      address: "bob.eth",
      avatar: "/placeholder.svg?height=40&width=40",
      isOnline: false,
    },
    {
      id: "3",
      name: "Charlie Davis",
      address: "0x8ba1f109551bD432803012645Hac136c22C501e3",
      avatar: "/placeholder.svg?height=40&width=40",
      isOnline: true,
    },
  ])

  const { toast } = useToast()

  const filteredContacts = contacts.filter(
    (contact) =>
      contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.address.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const handleAddContact = (newContact: { name: string; address: string; avatar: string }) => {
    const contact: Contact = {
      id: Date.now().toString(),
      ...newContact,
      isOnline: Math.random() > 0.5, // Random online status
    }
    setContacts((prev) => [...prev, contact])
  }

  const handleDeleteContact = (contactId: string) => {
    const contact = contacts.find((c) => c.id === contactId)
    setContacts((prev) => prev.filter((c) => c.id !== contactId))
    toast({
      title: "Contacto eliminado",
      description: `${contact?.name} ha sido eliminado de tus contactos`,
    })
  }

  const handleStartChat = (contact: Contact) => {
    toast({
      title: "Iniciando chat",
      description: `Abriendo conversación con ${contact.name}`,
    })
    // TODO: Navigate to chat with this contact
  }

  const handleSendCrypto = (contact: Contact) => {
    toast({
      title: "Enviar cripto",
      description: `Abriendo wallet para enviar a ${contact.name}`,
    })
    // TODO: Open send crypto modal with pre-filled recipient
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-foreground">Contactos</h1>
          <Button size="sm" onClick={() => setShowAddModal(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Agregar
          </Button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Buscar contactos o direcciones..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Contacts List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {filteredContacts.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground mb-4">
              {searchQuery ? "No se encontraron contactos" : "No tienes contactos agregados"}
            </p>
            {!searchQuery && (
              <Button onClick={() => setShowAddModal(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Agregar tu primer contacto
              </Button>
            )}
          </div>
        ) : (
          filteredContacts.map((contact) => (
            <Card key={contact.id} className="hover:bg-muted/50 transition-colors">
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <Avatar>
                      <AvatarImage src={contact.avatar || "/placeholder.svg"} />
                      <AvatarFallback>{contact.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    {contact.isOnline && (
                      <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-background"></div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-foreground">{contact.name}</h3>
                    <p className="text-sm text-muted-foreground truncate font-mono">{contact.address}</p>
                  </div>

                  <div className="flex space-x-2">
                    <Button variant="ghost" size="sm" onClick={() => handleStartChat(contact)}>
                      <MessageCircle className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleSendCrypto(contact)}>
                      <Send className="w-4 h-4" />
                    </Button>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <Edit className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleDeleteContact(contact.id)} className="text-red-600">
                          <Trash2 className="w-4 h-4 mr-2" />
                          Eliminar contacto
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      <AddContactModal open={showAddModal} onOpenChange={setShowAddModal} onAddContact={handleAddContact} />
    </div>
  )
}
