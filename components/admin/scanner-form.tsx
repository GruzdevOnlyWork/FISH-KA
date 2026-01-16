"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { QrCode, Search, ArrowRight } from "lucide-react"

export function ScannerForm() {
  const [qrCode, setQrCode] = useState("")
  const router = useRouter()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (qrCode.trim()) {
      router.push(`/admin/orders/${qrCode.trim()}`)
    }
  }

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center p-6">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            <QrCode className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="text-2xl">Поиск заказа</CardTitle>
          <CardDescription>Введите код заказа или отсканируйте QR-код клиента</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="text"
                placeholder="FISHKA-1234567890-ABC123"
                className="pl-10 pr-4"
                value={qrCode}
                onChange={(e) => setQrCode(e.target.value)}
                autoFocus
              />
            </div>
            <Button type="submit" className="w-full gap-2" disabled={!qrCode.trim()}>
              Найти заказ
              <ArrowRight className="h-4 w-4" />
            </Button>
          </form>

          <div className="mt-6 rounded-lg bg-secondary/50 p-4">
            <h3 className="mb-2 font-medium">Как использовать:</h3>
            <ol className="space-y-2 text-sm text-muted-foreground">
              <li>1. Попросите клиента показать QR-код</li>
              <li>2. Отсканируйте QR камерой телефона</li>
              <li>3. Или введите код вручную выше</li>
              <li>4. Выдайте товары и отметьте как выданные</li>
            </ol>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
