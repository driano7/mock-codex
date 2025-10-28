"use client"

import { useState } from "react"
import { Sun, Globe, LogOut, Shield, Smartphone, Bell } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"

export function SettingsPage() {
  const [theme, setTheme] = useState("system")
  const [language, setLanguage] = useState("es")
  const [chatSync, setChatSync] = useState(true)
  const [notifications, setNotifications] = useState(true)
  const [recoveryWallet, setRecoveryWallet] = useState("0x742d35Cc6634C0532925a3b8D4C9db96590b5b8c")
  const [showLogoutDialog, setShowLogoutDialog] = useState(false)
  const { toast } = useToast()

  const languages = [
    { code: "es", name: "Español", flag: "🇪🇸" },
    { code: "en", name: "English", flag: "🇺🇸" },
    { code: "zh", name: "中文", flag: "🇨🇳" },
    { code: "ar", name: "العربية", flag: "🇸🇦" },
    { code: "hi", name: "हिन्दी", flag: "🇮🇳" },
    { code: "fr", name: "Français", flag: "🇫🇷" },
    { code: "ru", name: "Русский", flag: "🇷🇺" },
    { code: "pt", name: "Português", flag: "🇧🇷" },
    { code: "bn", name: "বাংলা", flag: "🇧🇩" },
    { code: "de", name: "Deutsch", flag: "🇩🇪" },
  ]

  const handleLogout = () => {
    toast({
      title: "Sesión cerrada",
      description: "Has cerrado sesión exitosamente",
    })
    setShowLogoutDialog(false)
    // TODO: Implement actual logout logic
  }

  const handleRecoveryWalletChange = () => {
    toast({
      title: "Wallet de recuperación actualizada",
      description: "La nueva dirección ha sido guardada",
    })
  }

  return (
    <div className="p-4 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground mb-2">Configuración</h1>
        <p className="text-muted-foreground">Personaliza tu experiencia en la aplicación</p>
      </div>

      {/* Appearance */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Sun className="w-5 h-5 mr-2" />
            Apariencia
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-foreground font-medium">Tema</span>
              <p className="text-sm text-muted-foreground">Elige el tema de la aplicación</p>
            </div>
            <Select value={theme} onValueChange={setTheme}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="light">Claro</SelectItem>
                <SelectItem value="dark">Oscuro</SelectItem>
                <SelectItem value="dim">Dim</SelectItem>
                <SelectItem value="system">Sistema</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Language */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Globe className="w-5 h-5 mr-2" />
            Idioma
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <span className="text-foreground font-medium">Idioma de la interfaz</span>
              <p className="text-sm text-muted-foreground">Autodetectado del dispositivo</p>
            </div>
            <Select value={language} onValueChange={setLanguage}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {languages.map((lang) => (
                  <SelectItem key={lang.code} value={lang.code}>
                    <span className="flex items-center">
                      <span className="mr-2">{lang.flag}</span>
                      {lang.name}
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Notifications */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Bell className="w-5 h-5 mr-2" />
            Notificaciones
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-foreground font-medium">Notificaciones push</span>
              <p className="text-sm text-muted-foreground">Recibir notificaciones de mensajes y transacciones</p>
            </div>
            <Switch checked={notifications} onCheckedChange={setNotifications} />
          </div>
        </CardContent>
      </Card>

      {/* Privacy & Security */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Shield className="w-5 h-5 mr-2" />
            Privacidad y Seguridad
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-foreground font-medium">Sincronización de chats</span>
              <p className="text-sm text-muted-foreground">Sincronizar mensajes entre dispositivos</p>
            </div>
            <Switch checked={chatSync} onCheckedChange={setChatSync} />
          </div>

          <div className="pt-4 border-t border-border">
            <div className="space-y-3">
              <div>
                <span className="text-foreground font-medium">Wallet de recuperación</span>
                <p className="text-sm text-muted-foreground">Dirección para recuperar tu cuenta</p>
              </div>

              <div className="bg-muted p-3 rounded-lg">
                <p className="text-sm font-mono text-foreground break-all">{recoveryWallet}</p>
              </div>

              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    Cambiar Wallet
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Cambiar Wallet de Recuperación</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="recovery-wallet">Nueva dirección o ENS</Label>
                      <Input
                        id="recovery-wallet"
                        value={recoveryWallet}
                        onChange={(e) => setRecoveryWallet(e.target.value)}
                        placeholder="0x... o nombre.eth"
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        Se agregará .eth automáticamente si no se especifica
                      </p>
                    </div>
                    <div className="flex justify-end space-x-2">
                      <Button variant="outline">Cancelar</Button>
                      <Button onClick={handleRecoveryWalletChange}>Guardar</Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Device Management */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Smartphone className="w-5 h-5 mr-2" />
            Dispositivos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
              <div>
                <p className="font-medium text-foreground">Este dispositivo</p>
                <p className="text-sm text-muted-foreground">Última actividad: Ahora</p>
              </div>
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="space-y-3">
        <Dialog open={showLogoutDialog} onOpenChange={setShowLogoutDialog}>
          <DialogTrigger asChild>
            <Button variant="destructive" className="w-full">
              <LogOut className="w-4 h-4 mr-2" />
              Cerrar Sesión
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Confirmar cierre de sesión</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <p className="text-muted-foreground">
                ¿Estás seguro de que quieres cerrar sesión? Tendrás que volver a conectar tu wallet.
              </p>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setShowLogoutDialog(false)}>
                  Cancelar
                </Button>
                <Button variant="destructive" onClick={handleLogout}>
                  Cerrar Sesión
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
