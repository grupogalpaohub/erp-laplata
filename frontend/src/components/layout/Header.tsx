'use client'

import { useState } from 'react'
import { Menu, Bell, User, LogOut, Search, HelpCircle, Command } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'

interface HeaderProps {
  onMenuClick?: () => void
  title?: string
  subtitle?: string
}

export function Header({ onMenuClick, title = 'Dashboard', subtitle = 'Visão geral do sistema' }: HeaderProps) {
  const { user, signOut } = useAuth()
  const [searchOpen, setSearchOpen] = useState(false)

  return (
    <header className="bg-white border-b border-gray-200 lg:ml-72">
      <div className="flex items-center justify-between h-16 px-4 lg:px-6">
        {/* Left side */}
        <div className="flex items-center space-x-4">
          {onMenuClick && (
            <button
              onClick={onMenuClick}
              className="p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 lg:hidden"
            >
              <Menu className="h-5 w-5" />
            </button>
          )}
          
          <div className="hidden sm:block">
            <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
            <p className="text-sm text-gray-500">{subtitle}</p>
          </div>
        </div>
        
        {/* Center - Search */}
        <div className="flex-1 max-w-md mx-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Buscar no sistema... (Ctrl+K)"
              className="pl-10 pr-4 py-2 w-full text-sm border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              onFocus={() => setSearchOpen(true)}
            />
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <kbd className="inline-flex items-center px-2 py-1 text-xs font-mono text-gray-500 bg-gray-100 rounded">
                <Command className="h-3 w-3 mr-1" />
                K
              </kbd>
            </div>
          </div>
        </div>
        
        {/* Right side */}
        <div className="flex items-center space-x-2">
          {/* Help */}
          <Button
            variant="ghost"
            size="sm"
            className="hidden sm:flex items-center space-x-1 text-gray-600 hover:text-gray-900"
          >
            <HelpCircle className="h-4 w-4" />
            <span className="text-sm">Ajuda</span>
          </Button>
          
          {/* Notifications */}
          <Button
            variant="ghost"
            size="sm"
            className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg"
          >
            <Bell className="h-5 w-5" />
            <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
              3
            </span>
          </Button>
          
          {/* User menu */}
          <div className="flex items-center space-x-3 pl-2 border-l border-gray-200">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <User className="h-4 w-4 text-blue-600" />
            </div>
            <div className="hidden sm:block">
              <p className="text-sm font-medium text-gray-900">
                {user?.email?.split('@')[0] || 'Usuário'}
              </p>
              <p className="text-xs text-gray-500">LaplataLunaria</p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={signOut}
              className="text-gray-600 hover:text-gray-900 p-2"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}