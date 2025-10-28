"use client"

import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Copy, Edit, Check } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false)
  const [copied, setCopied] = useState(false)
  const { toast } = useToast()

  const [profile, setProfile] = useState({
    name: "John Doe",
    description: "Crypto enthusiast & DeFi trader",
    avatar: "/diverse-user-avatars.png",
  })

  const userAddress = "0x742d35Cc6634C0532925a3b8D4C9db96590b5b8c"

  const copyAddress = async () => {
    try {
      await navigator.clipboard.writeText(userAddress)
      setCopied(true)
      toast({
        title: "Dirección copiada",
        description: "La dirección EVM ha sido copiada al portapapeles",
      })
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      toast({
        title: "Error",
        description: "No se pudo copiar la dirección",
        variant: "destructive",
      })
    }
  }

  const handleSaveProfile = () => {
    setIsEditing(false)
    toast({
      title: "Perfil actualizado",
      description: "Los cambios han sido guardados exitosamente",
    })
  }

  return (
    <div className="p-4 space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <Avatar className="w-24 h-24 mx-auto">
          <AvatarImage src={profile.avatar || "/placeholder.svg"} />
          <AvatarFallback className="text-2xl bg-primary/20 text-primary">
            {profile.name
              .split(" ")
              .map((n) => n[0])
              .join("")}
          </AvatarFallback>
        </Avatar>

        <div>
          <h1 className="text-2xl font-bold text-foreground">{profile.name}</h1>
          <p className="text-muted-foreground">{profile.description}</p>
        </div>

        <Dialog open={isEditing} onOpenChange={setIsEditing}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm">
              <Edit className="w-4 h-4 mr-2" />
              Editar Perfil
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Editar Perfil</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Nombre</Label>
                <Input
                  id="name"
                  value={profile.name}
                  onChange={(e) => setProfile((prev) => ({ ...prev, name: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="description">Descripción</Label>
                <Textarea
                  id="description"
                  value={profile.description}
                  onChange={(e) => setProfile((prev) => ({ ...prev, description: e.target.value }))}
                  rows={3}
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsEditing(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleSaveProfile}>Guardar</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Wallet Address */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Dirección EVM Pública</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between bg-muted p-3 rounded-lg">
            <span className="font-mono text-sm text-foreground truncate">{userAddress}</span>
            <Button variant="ghost" size="sm" onClick={copyAddress} className="ml-2 flex-shrink-0">
              {copied ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-2">Esta es tu dirección pública para recibir criptomonedas</p>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-primary">24</div>
            <div className="text-sm text-muted-foreground">Contactos</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-primary">156</div>
            <div className="text-sm text-muted-foreground">Transacciones</div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Actividad Reciente</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between py-2 border-b border-border last:border-b-0">
              <div>
                <p className="text-sm font-medium text-foreground">Enviado a Alice</p>
                <p className="text-xs text-muted-foreground">Hace 2 horas</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-red-600">-0.5 ETH</p>
                <p className="text-xs text-muted-foreground">$1,170.25</p>
              </div>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-border last:border-b-0">
              <div>
                <p className="text-sm font-medium text-foreground">Recibido de Bob</p>
                <p className="text-xs text-muted-foreground">Hace 1 día</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-green-600">+250 USDC</p>
                <p className="text-xs text-muted-foreground">$250.00</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
