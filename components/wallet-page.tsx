"use client"

import { useState } from "react"
import { TrendingUp, TrendingDown, Plus, Zap, UserPlus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"

interface Token {
  symbol: string
  name: string
  balance: number
  price: number
  change24h: number
  balanceUSD: number
  icon: string
}

interface GasEstimate {
  slow: number
  standard: number
  fast: number
  average: number
}

export function WalletPage() {
  const [hideZeroBalances, setHideZeroBalances] = useState(false)
  const [showSendDialog, setShowSendDialog] = useState(false)
  const [showReceiptDialog, setShowReceiptDialog] = useState(false)
  const [selectedToken, setSelectedToken] = useState("")
  const [recipient, setRecipient] = useState("")
  const [amountUSD, setAmountUSD] = useState("")
  const [selectedGasLevel, setSelectedGasLevel] = useState("standard")
  const [saveContact, setSaveContact] = useState(false)
  const { toast } = useToast()

  const tokens: Token[] = [
    {
      symbol: "ETH",
      name: "Ethereum",
      balance: 2.45,
      price: 2340.5,
      change24h: 3.2,
      balanceUSD: 5734.23,
      icon: "⟠",
    },
    {
      symbol: "USDC",
      name: "USD Coin",
      balance: 1250.0,
      price: 1.0,
      change24h: 0.01,
      balanceUSD: 1250.0,
      icon: "💵",
    },
    {
      symbol: "BTC",
      name: "Bitcoin",
      balance: 0.15,
      price: 43250.0,
      change24h: -1.8,
      balanceUSD: 6487.5,
      icon: "₿",
    },
    {
      symbol: "LINK",
      name: "Chainlink",
      balance: 0,
      price: 14.25,
      change24h: 5.7,
      balanceUSD: 0,
      icon: "🔗",
    },
    {
      symbol: "UNI",
      name: "Uniswap",
      balance: 45.2,
      price: 8.75,
      change24h: -2.1,
      balanceUSD: 395.5,
      icon: "🦄",
    },
  ]

  const gasEstimates: GasEstimate = {
    slow: 15,
    standard: 25,
    fast: 35,
    average: 25,
  }

  const [transactionData, setTransactionData] = useState({
    hash: "",
    amount: "",
    token: "",
    recipient: "",
    blockNumber: "",
    gasUsed: "",
  })

  const totalBalance = tokens.reduce((sum, token) => sum + token.balanceUSD, 0)

  const filteredTokens = hideZeroBalances ? tokens.filter((token) => token.balance > 0) : tokens

  const selectedTokenData = tokens.find((t) => t.symbol === selectedToken)
  const tokenAmount =
    selectedTokenData && amountUSD ? (Number.parseFloat(amountUSD) / selectedTokenData.price).toFixed(6) : "0"

  const processRecipient = (address: string) => {
    if (address && !address.includes(".") && !address.startsWith("0x")) {
      return `${address}.eth`
    }
    return address
  }

  const handleSendTransaction = () => {
    if (!selectedToken || !recipient || !amountUSD) {
      toast({
        title: "Error",
        description: "Por favor completa todos los campos",
        variant: "destructive",
      })
      return
    }

    const processedRecipient = processRecipient(recipient)
    const mockHash = `0x${Math.random().toString(16).substr(2, 64)}`
    const mockBlock = Math.floor(Math.random() * 1000000) + 18000000

    setTransactionData({
      hash: mockHash,
      amount: tokenAmount,
      token: selectedToken,
      recipient: processedRecipient,
      blockNumber: mockBlock.toString(),
      gasUsed: gasEstimates[selectedGasLevel as keyof GasEstimate].toString(),
    })

    if (saveContact && processedRecipient) {
      toast({
        title: "Contacto guardado",
        description: `${processedRecipient} ha sido agregado a tus contactos`,
      })
    }

    setShowSendDialog(false)
    setShowReceiptDialog(true)

    setSelectedToken("")
    setRecipient("")
    setAmountUSD("")
    setSaveContact(false)

    toast({
      title: "Transacción enviada",
      description: "Tu transacción ha sido procesada exitosamente",
    })
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast({
      title: "Copiado",
      description: "Texto copiado al portapapeles",
    })
  }

  const shareReceipt = () => {
    if (navigator.share) {
      navigator.share({
        title: "Comprobante de Transacción",
        text: `Transacción: ${transactionData.hash}\nCantidad: ${transactionData.amount} ${transactionData.token}\nDestinatario: ${transactionData.recipient}`,
      })
    } else {
      copyToClipboard(
        `Transacción: ${transactionData.hash}\nCantidad: ${transactionData.amount} ${transactionData.token}\nDestinatario: ${transactionData.recipient}`,
      )
    }
  }

  return (
    <div className="p-4 space-y-6">
      <Card className="bg-gradient-to-br from-primary/10 via-primary/5 to-accent/10 border-primary/20">
        <CardContent className="p-6 text-center">
          <p className="text-sm text-muted-foreground mb-2">Balance Total</p>
          <h2 className="text-3xl font-bold text-foreground mb-4">
            ${totalBalance.toLocaleString("en-US", { minimumFractionDigits: 2 })}
          </h2>

          <Dialog open={showSendDialog} onOpenChange={setShowSendDialog}>
            <DialogTrigger asChild>
              <Button className="w-full" size="lg">
                <Plus className="w-4 h-4 mr-2" />
                Enviar Tokens
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Enviar Criptomonedas</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="token">Token</Label>
                  <Select value={selectedToken} onValueChange={setSelectedToken}>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar token" />
                    </SelectTrigger>
                    <SelectContent>
                      {tokens
                        .filter((t) => t.balance > 0)
                        .map((token) => (
                          <SelectItem key={token.symbol} value={token.symbol}>
                            <div className="flex items-center space-x-2">
                              <span>{token.icon}</span>
                              <span>{token.symbol}</span>
                              <span className="text-muted-foreground">({token.balance})</span>
                            </div>
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="amount">Cantidad (USD)</Label>
                  <Input
                    id="amount"
                    type="number"
                    placeholder="0.00"
                    value={amountUSD}
                    onChange={(e) => setAmountUSD(e.target.value)}
                  />
                  {selectedTokenData && amountUSD && (
                    <p className="text-xs text-muted-foreground mt-1">
                      {tokenAmount} {selectedToken} (${Number.parseFloat(amountUSD).toFixed(2)})
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="recipient">Destinatario</Label>
                  <Input
                    id="recipient"
                    placeholder="0x... o nombre.eth"
                    value={recipient}
                    onChange={(e) => setRecipient(e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground mt-1">Se agregará .eth automáticamente si es necesario</p>
                  {recipient && (
                    <div className="flex items-center space-x-2 mt-3 p-3 bg-muted/50 rounded-lg">
                      <Checkbox id="save-contact" checked={saveContact} onCheckedChange={setSaveContact} />
                      <Label htmlFor="save-contact" className="text-sm flex items-center cursor-pointer">
                        <UserPlus className="w-4 h-4 mr-1" />
                        Guardar como contacto para mensajes
                      </Label>
                    </div>
                  )}
                </div>

                <div>
                  <Label>Velocidad de transacción</Label>
                  <div className="grid grid-cols-3 gap-2 mt-2">
                    {Object.entries(gasEstimates)
                      .filter(([key]) => key !== "average")
                      .map(([level, price]) => (
                        <Button
                          key={level}
                          variant={selectedGasLevel === level ? "default" : "outline"}
                          size="sm"
                          onClick={() => setSelectedGasLevel(level)}
                          className="flex flex-col h-auto p-2"
                        >
                          <span className="text-xs capitalize">{level}</span>
                          <span className="text-xs font-mono">${price}</span>
                          <div
                            className={cn(
                              "flex items-center text-xs mt-1",
                              price < gasEstimates.average
                                ? "text-green-600"
                                : price > gasEstimates.average
                                  ? "text-red-600"
                                  : "text-muted-foreground",
                            )}
                          >
                            {price < gasEstimates.average ? (
                              <TrendingDown className="w-3 h-3 mr-1" />
                            ) : price > gasEstimates.average ? (
                              <TrendingUp className="w-3 h-3 mr-1" />
                            ) : (
                              <Zap className="w-3 h-3 mr-1" />
                            )}
                            {price < gasEstimates.average ? "Bajo" : price > gasEstimates.average ? "Alto" : "Promedio"}
                          </div>
                        </Button>
                      ))}
                  </div>
                </div>

                <div className="flex justify-end space-x-2 pt-4">
                  <Button variant="outline" onClick={() => setShowSendDialog(false)}>
                    Cancelar
                  </Button>
                  <Button onClick={handleSendTransaction}>Confirmar Envío</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>

      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-foreground">Mis Tokens</h3>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-muted-foreground">Ocultar balance 0</span>
          <Switch checked={hideZeroBalances} onCheckedChange={setHideZeroBalances} />
        </div>
      </div>

      <div className="space-y-3">
        {filteredTokens.map((token) => (
          <Card key={token.symbol} className="cursor-pointer hover:bg-muted/50 transition-colors">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center text-lg">
                    {token.icon}
                  </div>

                  <div>
                    <h4 className="font-semibold text-foreground">{token.name}</h4>
                    <p className="text-sm text-muted-foreground">
                      {token.balance} {token.symbol}
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <p className="font-semibold text-foreground">
                    ${token.balanceUSD.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                  </p>
                  <div
                    className={cn(
                      "flex items-center justify-end text-sm",
                      token.change24h >= 0 ? "text-green-600" : "text-red-600",
                    )}
                  >
                    {token.change24h >= 0 ? (
                      <TrendingUp className="w-3 h-3 mr-1" />
                    ) : (
                      <TrendingDown className="w-3 h-3 mr-1" />
                    )}
                    {Math.abs(token.change24h).toFixed(2)}%
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={showReceiptDialog} onOpenChange={setShowReceiptDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-2">
                <div className="w-4 h-4 bg-green-600 rounded-full"></div>
              </div>
              Transacción Completada
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="bg-muted p-4 rounded-lg space-y-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Cantidad:</span>
                <span className="font-semibold">
                  {transactionData.amount} {transactionData.token}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Destinatario:</span>
                <span className="font-mono text-sm truncate max-w-32" title={transactionData.recipient}>
                  {transactionData.recipient}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Hash:</span>
                <button
                  onClick={() => copyToClipboard(transactionData.hash)}
                  className="font-mono text-sm text-primary hover:underline truncate max-w-32"
                  title={transactionData.hash}
                >
                  {transactionData.hash.slice(0, 10)}...
                </button>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Bloque:</span>
                <span className="font-mono text-sm">{transactionData.blockNumber}</span>
              </div>
            </div>

            <div className="flex space-x-2">
              <Button
                variant="outline"
                className="flex-1 bg-transparent"
                onClick={() => window.open(`https://explorer.monad.xyz/tx/${transactionData.hash}`, "_blank")}
              >
                Ver en Explorer
              </Button>
              <Button variant="outline" className="flex-1 md:hidden bg-transparent" onClick={shareReceipt}>
                Compartir
              </Button>
            </div>

            <Button className="w-full" onClick={() => setShowReceiptDialog(false)}>
              Volver a Wallet
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
