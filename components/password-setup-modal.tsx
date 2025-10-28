"use client"

import { useState } from "react"
import { Eye, EyeOff, Check, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"

interface PasswordSetupModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onComplete: () => void
}

interface PasswordValidation {
  minLength: boolean
  hasLowercase: boolean
  hasUppercase: boolean
  hasNumber: boolean
  hasSpecialChar: boolean
  notCommon: boolean
}

export function PasswordSetupModal({ open, onOpenChange, onComplete }: PasswordSetupModalProps) {
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const { toast } = useToast()

  const commonPasswords = [
    "123456",
    "password",
    "123456789",
    "12345678",
    "12345",
    "1234567",
    "1234567890",
    "qwerty",
    "abc123",
    "password123",
  ]

  const validatePassword = (pwd: string): PasswordValidation => {
    return {
      minLength: pwd.length >= 8,
      hasLowercase: /[a-z]/.test(pwd),
      hasUppercase: /[A-Z]/.test(pwd),
      hasNumber: /\d/.test(pwd),
      hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(pwd),
      notCommon: !commonPasswords.includes(pwd.toLowerCase()),
    }
  }

  const validation = validatePassword(password)
  const isPasswordValid = Object.values(validation).every(Boolean)
  const passwordsMatch = password === confirmPassword && confirmPassword.length > 0

  const handleComplete = () => {
    if (!isPasswordValid) {
      toast({
        title: "Contraseña inválida",
        description: "Por favor cumple con todos los requisitos de seguridad",
        variant: "destructive",
      })
      return
    }

    if (!passwordsMatch) {
      toast({
        title: "Las contraseñas no coinciden",
        description: "Por favor verifica que ambas contraseñas sean iguales",
        variant: "destructive",
      })
      return
    }

    toast({
      title: "Contraseña establecida",
      description: "Tu contraseña ha sido configurada exitosamente",
    })

    onComplete()
    onOpenChange(false)
  }

  const ValidationItem = ({ isValid, text }: { isValid: boolean; text: string }) => (
    <div className={cn("flex items-center space-x-2 text-sm", isValid ? "text-green-600" : "text-muted-foreground")}>
      {isValid ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
      <span>{text}</span>
    </div>
  )

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Establecer Contraseña de Seguridad</DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          <p className="text-sm text-muted-foreground">
            Crea una contraseña segura para proteger tu wallet y mensajes cifrados.
          </p>

          {/* Password Input */}
          <div className="space-y-2">
            <Label htmlFor="password">Contraseña</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pr-10"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </Button>
            </div>
          </div>

          {/* Confirm Password Input */}
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirmar Contraseña</Label>
            <div className="relative">
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="pr-10"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </Button>
            </div>
            {confirmPassword.length > 0 && (
              <div className={cn("text-sm", passwordsMatch ? "text-green-600" : "text-red-600")}>
                {passwordsMatch ? "Las contraseñas coinciden" : "Las contraseñas no coinciden"}
              </div>
            )}
          </div>

          {/* Password Requirements */}
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-foreground">Requisitos de seguridad:</h4>
            <div className="space-y-1">
              <ValidationItem isValid={validation.minLength} text="Mínimo 8 caracteres" />
              <ValidationItem isValid={validation.hasLowercase} text="Al menos 1 letra minúscula" />
              <ValidationItem isValid={validation.hasUppercase} text="Al menos 1 letra mayúscula" />
              <ValidationItem isValid={validation.hasNumber} text="Al menos 1 número" />
              <ValidationItem isValid={validation.hasSpecialChar} text="Al menos 1 carácter especial" />
              <ValidationItem isValid={validation.notCommon} text="No ser una contraseña común" />
            </div>
          </div>

          <Button onClick={handleComplete} disabled={!isPasswordValid || !passwordsMatch} className="w-full" size="lg">
            Finalizar Configuración
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
