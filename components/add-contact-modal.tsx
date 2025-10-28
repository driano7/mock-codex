"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useToast } from "@/hooks/use-toast"

interface AddContactModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onAddContact: (contact: { name: string; address: string; avatar: string }) => void
}

export function AddContactModal({ open, onOpenChange, onAddContact }: AddContactModalProps) {
  const [name, setName] = useState("")
  const [address, setAddress] = useState("")
  const [isValidating, setIsValidating] = useState(false)
  const { toast } = useToast()

  const processAddress = (addr: string) => {
    // Auto-add .eth if it looks like an ENS name
    if (addr && !addr.includes(".") && !addr.startsWith("0x") && addr.length > 0) {
      return `${addr}.eth`
    }
    return addr
  }

  const validateAddress = (addr: string) => {
    const processedAddr = processAddress(addr)
    // Basic validation for ETH address or ENS
    if (processedAddr.startsWith("0x")) {
      return processedAddr.length === 42 && /^0x[a-fA-F0-9]{40}$/.test(processedAddr)
    }
    if (processedAddr.endsWith(".eth")) {
      return processedAddr.length > 4
    }
    return false
  }

  const handleAddContact = async () => {
    if (!name.trim()) {
      toast({
        title: "Error",
        description: "Por favor ingresa un nombre para el contacto",
        variant: "destructive",
      })
      return
    }

    const processedAddress = processAddress(address)

    if (!validateAddress(processedAddress)) {
      toast({
        title: "Dirección inválida",
        description: "Por favor ingresa una dirección ETH válida o nombre ENS",
        variant: "destructive",
      })
      return
    }

    setIsValidating(true)

    // Simulate address validation
    setTimeout(() => {
      onAddContact({
        name: name.trim(),
        address: processedAddress,
        avatar: `/placeholder.svg?height=40&width=40&query=${name}`,
      })

      toast({
        title: "Contacto agregado",
        description: `${name} ha sido agregado a tus contactos`,
      })

      setName("")
      setAddress("")
      setIsValidating(false)
      onOpenChange(false)
    }, 1500)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Agregar Nuevo Contacto</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="flex justify-center">
            <Avatar className="w-16 h-16">
              <AvatarImage src={`/abstract-geometric-shapes.png?height=64&width=64&query=${name || "user"}`} />
              <AvatarFallback className="text-lg">
                {name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .toUpperCase() || "?"}
              </AvatarFallback>
            </Avatar>
          </div>

          <div className="space-y-2">
            <Label htmlFor="contact-name">Nombre del contacto</Label>
            <Input
              id="contact-name"
              placeholder="Ej: Alice Cooper"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="contact-address">Dirección o ENS</Label>
            <Input
              id="contact-address"
              placeholder="0x... o nombre.eth"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">Se agregará .eth automáticamente si es necesario</p>
            {address && (
              <p className="text-xs text-muted-foreground">
                Dirección procesada: <span className="font-mono">{processAddress(address)}</span>
              </p>
            )}
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isValidating}>
              Cancelar
            </Button>
            <Button onClick={handleAddContact} disabled={isValidating}>
              {isValidating ? "Validando..." : "Agregar Contacto"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
