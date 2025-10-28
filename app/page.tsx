"use client"

import { useState, useEffect } from "react"
import { User, MessageCircle, Wallet, Settings, Users } from "lucide-react"
import { cn } from "@/lib/utils"
import { ProfilePage } from "@/components/profile-page"
import { ConversationsPage } from "@/components/conversations-page"
import { WalletPage } from "@/components/wallet-page"
import { SettingsPage } from "@/components/settings-page"
import { ContactsPage } from "@/components/contacts-page"
import { PasswordSetupModal } from "@/components/password-setup-modal"

type TabType = "profile" | "conversations" | "wallet" | "settings" | "contacts"

export default function CryptoMessagingApp() {
  const [activeTab, setActiveTab] = useState<TabType>("conversations")
  const [showPasswordSetup, setShowPasswordSetup] = useState(false)
  const [isFirstTime, setIsFirstTime] = useState(true)

  // Simulate first-time user check
  useEffect(() => {
    const hasSetupPassword = localStorage.getItem("crypto-app-password-setup")
    if (!hasSetupPassword && isFirstTime) {
      setShowPasswordSetup(true)
    }
  }, [isFirstTime])

  const handlePasswordSetupComplete = () => {
    localStorage.setItem("crypto-app-password-setup", "true")
    setIsFirstTime(false)
  }

  const tabs = [
    { id: "profile" as TabType, icon: User, label: "Perfil" },
    { id: "conversations" as TabType, icon: MessageCircle, label: "Chats" },
    { id: "wallet" as TabType, icon: Wallet, label: "Wallet" },
    { id: "settings" as TabType, icon: Settings, label: "Ajustes" },
    { id: "contacts" as TabType, icon: Users, label: "Contactos" },
  ]

  const renderContent = () => {
    switch (activeTab) {
      case "profile":
        return <ProfilePage />
      case "conversations":
        return <ConversationsPage />
      case "wallet":
        return <WalletPage />
      case "settings":
        return <SettingsPage />
      case "contacts":
        return <ContactsPage />
      default:
        return <ConversationsPage />
    }
  }

  return (
    <div className="flex flex-col h-screen relative">
      {/* Main Content */}
      <main className="flex-1 overflow-hidden">{renderContent()}</main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-4 left-2 right-2 mx-auto z-50">
        <div className="max-w-md mx-auto">
          <div
            className="bg-card/70 backdrop-blur-xl border border-border/20 rounded-3xl p-2"
            style={{
              background: "linear-gradient(135deg, rgba(99, 102, 241, 0.15) 0%, rgba(168, 85, 247, 0.08) 100%)",
              boxShadow: `
                0 25px 50px -12px rgba(0, 0, 0, 0.25),
                0 20px 40px -8px rgba(99, 102, 241, 0.2),
                0 8px 32px rgba(99, 102, 241, 0.15),
                0 0 0 1px rgba(255, 255, 255, 0.1),
                inset 0 1px 0 rgba(255, 255, 255, 0.15),
                inset 0 -1px 0 rgba(0, 0, 0, 0.1)
              `,
              transform: "translateZ(0)",
            }}
          >
            {/* Horizontal scrollable container */}
            <div className="flex gap-2 overflow-x-auto scrollbar-hide px-1">
              {tabs.map((tab, index) => {
                const Icon = tab.icon
                const isActive = activeTab === tab.id

                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={cn(
                      "flex flex-col items-center gap-1.5 px-4 py-3 rounded-2xl transition-all duration-300 transform min-w-[70px] flex-shrink-0 relative",
                      isActive ? "text-white scale-105" : "text-muted-foreground hover:text-foreground hover:scale-105",
                    )}
                    style={
                      isActive
                        ? {
                            background:
                              "linear-gradient(135deg, rgba(99, 102, 241, 0.95) 0%, rgba(168, 85, 247, 0.9) 100%)",
                            boxShadow: `
                              0 12px 24px rgba(99, 102, 241, 0.4),
                              0 6px 12px rgba(99, 102, 241, 0.3),
                              0 2px 4px rgba(0, 0, 0, 0.1),
                              inset 0 1px 0 rgba(255, 255, 255, 0.3),
                              inset 0 -1px 0 rgba(0, 0, 0, 0.1)
                            `,
                            transform: "translateY(-2px) translateZ(10px)",
                          }
                        : {
                            background: "rgba(255, 255, 255, 0.08)",
                            backdropFilter: "blur(10px)",
                            boxShadow: `
                              0 4px 8px rgba(0, 0, 0, 0.1),
                              0 1px 2px rgba(0, 0, 0, 0.05),
                              inset 0 1px 0 rgba(255, 255, 255, 0.1)
                            `,
                          }
                    }
                  >
                    <Icon className="w-5 h-5" />
                    <span className="text-xs font-medium whitespace-nowrap">{tab.label}</span>
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      </nav>

      {/* Password Setup Modal */}
      <PasswordSetupModal
        open={showPasswordSetup}
        onOpenChange={setShowPasswordSetup}
        onComplete={handlePasswordSetupComplete}
      />
    </div>
  )
}
