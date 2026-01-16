"use client"

import type React from "react"

import Image from "next/image"
import Link from "next/link"
import { ShoppingCart, Menu, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { useCartStore } from "@/lib/cart-store"
import { useState } from "react"

interface HeaderProps {
  onSearch?: (query: string) => void
  searchQuery?: string
}

export function Header({ onSearch, searchQuery = "" }: HeaderProps) {
  const totalItems = useCartStore((state) => state.getTotalItems())
  const [isOpen, setIsOpen] = useState(false)
  const [localSearch, setLocalSearch] = useState(searchQuery)

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    onSearch?.(localSearch)
  }

  const navLinks = [
    { href: "/", label: "Каталог" },
    { href: "/cart", label: "Корзина" },
  ]

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
      <div className="container mx-auto flex h-16 items-center justify-between gap-4 px-4">
        <Link href="/" className="flex items-center gap-2">
          <Image src="/images/image.png" alt="FISH-KA" width={48} height={48} className="h-12 w-12 object-contain" />
          <span className="hidden text-xl font-bold text-accent sm:block">FISH-KA</span>
        </Link>

        {onSearch && (
          <form onSubmit={handleSearch} className="hidden flex-1 max-w-md md:flex">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Поиск товаров..."
                className="pl-10 pr-4"
                value={localSearch}
                onChange={(e) => setLocalSearch(e.target.value)}
              />
            </div>
          </form>
        )}

        <nav className="hidden items-center gap-4 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-foreground/80 transition-colors hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
          <Link href="/cart">
            <Button variant="outline" size="icon" className="relative bg-transparent">
              <ShoppingCart className="h-5 w-5" />
              {totalItems > 0 && (
                <Badge className="absolute -right-2 -top-2 h-5 w-5 rounded-full bg-accent p-0 text-xs text-accent-foreground">
                  {totalItems}
                </Badge>
              )}
              <span className="sr-only">Корзина</span>
            </Button>
          </Link>
        </nav>

        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon">
              <Menu className="h-6 w-6" />
              <span className="sr-only">Меню</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[280px]">
            <div className="flex flex-col gap-6 pt-6">
              {onSearch && (
                <form onSubmit={handleSearch}>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      type="search"
                      placeholder="Поиск товаров..."
                      className="pl-10"
                      value={localSearch}
                      onChange={(e) => setLocalSearch(e.target.value)}
                    />
                  </div>
                </form>
              )}
              <nav className="flex flex-col gap-4">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="text-lg font-medium"
                    onClick={() => setIsOpen(false)}
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
              <Link href="/cart" onClick={() => setIsOpen(false)}>
                <Button className="w-full gap-2">
                  <ShoppingCart className="h-5 w-5" />
                  Корзина
                  {totalItems > 0 && (
                    <Badge variant="secondary" className="ml-auto">
                      {totalItems}
                    </Badge>
                  )}
                </Button>
              </Link>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  )
}
