"use client"

import Link from "next/link"
import Image from "next/image"
import { usePathname, useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/client"
import { LayoutDashboard, Package, ShoppingCart, LogOut, Store, QrCode } from "lucide-react"
import type { User } from "@supabase/supabase-js"

interface AdminSidebarProps {
  user: User
}

const navItems = [
  { href: "/admin", icon: LayoutDashboard, label: "Панель управления" },
  { href: "/admin/orders", icon: ShoppingCart, label: "Заказы" },
  { href: "/admin/products", icon: Package, label: "Товары" },
  { href: "/admin/scan", icon: QrCode, label: "Сканер QR" },
]

export function AdminSidebar({ user }: AdminSidebarProps) {
  const pathname = usePathname()
  const router = useRouter()

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push("/auth/login")
    router.refresh()
  }

  return (
    <aside className="flex w-64 flex-col border-r bg-card">
      <div className="flex h-16 items-center gap-3 border-b px-4">
        <Image src="/images/image.png" alt="FISH-KA" width={40} height={40} />
        <div>
          <h2 className="font-bold text-accent">FISH-KA</h2>
          <p className="text-xs text-muted-foreground">Админ-панель</p>
        </div>
      </div>

      <nav className="flex-1 space-y-1 p-4">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href))
          return (
            <Link key={item.href} href={item.href}>
              <Button
                variant="ghost"
                className={cn("w-full justify-start gap-3", isActive && "bg-primary/10 text-primary")}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Button>
            </Link>
          )
        })}
      </nav>

      <div className="border-t p-4">
        <Link href="/">
          <Button variant="outline" className="mb-2 w-full justify-start gap-3 bg-transparent">
            <Store className="h-4 w-4" />
            Открыть магазин
          </Button>
        </Link>
        <div className="mb-3 rounded-lg bg-secondary p-3">
          <p className="truncate text-sm font-medium">{user.email}</p>
          <p className="text-xs text-muted-foreground">Администратор</p>
        </div>
        <Button
          variant="ghost"
          className="w-full justify-start gap-3 text-destructive hover:bg-destructive/10 hover:text-destructive"
          onClick={handleLogout}
        >
          <LogOut className="h-4 w-4" />
          Выйти
        </Button>
      </div>
    </aside>
  )
}
