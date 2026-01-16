"use client"

import { useRef } from "react"
import Image from "next/image"
import Link from "next/link"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { QRCodeSVG } from "qrcode.react"
import type { Order, OrderItem } from "@/lib/types"
import { Check, Clock, X, Home, Download, Share2 } from "lucide-react"

interface OrderDetailsProps {
  order: Order
  orderItems: (OrderItem & { product: { name: string; image_url: string | null; price: number } })[]
}

const statusConfig = {
  pending: {
    label: "Ожидает выдачи",
    icon: Clock,
    variant: "secondary" as const,
  },
  completed: {
    label: "Выполнен",
    icon: Check,
    variant: "default" as const,
  },
  cancelled: {
    label: "Отменён",
    icon: X,
    variant: "destructive" as const,
  },
}

export function OrderDetails({ order, orderItems }: OrderDetailsProps) {
  const qrRef = useRef<HTMLDivElement>(null)

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("ru-RU", {
      style: "currency",
      currency: "RUB",
      maximumFractionDigits: 0,
    }).format(price)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("ru-RU", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const status = statusConfig[order.status]
  const StatusIcon = status.icon

  const handleDownloadQR = () => {
    if (!qrRef.current) return

    const svg = qrRef.current.querySelector("svg")
    if (!svg) return

    const svgData = new XMLSerializer().serializeToString(svg)
    const canvas = document.createElement("canvas")
    const ctx = canvas.getContext("2d")
    const img = document.createElement("img")

    img.onload = () => {
      canvas.width = 300
      canvas.height = 300
      ctx?.fillRect(0, 0, 300, 300)
      ctx?.drawImage(img, 0, 0, 300, 300)

      const pngFile = canvas.toDataURL("image/png")
      const downloadLink = document.createElement("a")
      downloadLink.download = `FISHKA-order-${order.qr_code}.png`
      downloadLink.href = pngFile
      downloadLink.click()
    }

    img.src = "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(svgData)))
  }

  const handleShare = async () => {
    const url = window.location.href
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Заказ FISH-KA ${order.qr_code}`,
          text: `Мой заказ в магазине FISH-KA на сумму ${formatPrice(order.total_amount)}`,
          url,
        })
      } catch {

      }
    } else {
      navigator.clipboard.writeText(url)
      alert("Ссылка скопирована в буфер обмена")
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-6">
        <div className="mx-auto max-w-2xl">
          <Card className="overflow-hidden">
            <CardHeader className="bg-primary/10 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/20">
                <StatusIcon className="h-8 w-8 text-primary" />
              </div>
              <CardTitle className="text-2xl">Заказ создан!</CardTitle>
              <p className="text-muted-foreground">Покажите QR-код продавцу для получения товаров</p>
            </CardHeader>
            <CardContent className="space-y-6 p-6">
              <div ref={qrRef} className="mx-auto flex w-fit flex-col items-center rounded-xl bg-card p-4 shadow-sm">
                <QRCodeSVG
                  value={`${typeof window !== "undefined" ? window.location.origin : ""}/admin/orders/${order.qr_code}`}
                  size={200}
                  level="H"
                  bgColor="white"
                  fgColor="#0d9488"
                />
                <p className="mt-2 font-mono text-sm text-muted-foreground">{order.qr_code}</p>
              </div>

              <div className="flex justify-center gap-2">
                <Button variant="outline" size="sm" onClick={handleDownloadQR} className="gap-2 bg-transparent">
                  <Download className="h-4 w-4" />
                  Скачать QR
                </Button>
                <Button variant="outline" size="sm" onClick={handleShare} className="gap-2 bg-transparent">
                  <Share2 className="h-4 w-4" />
                  Поделиться
                </Button>
              </div>

              <Separator />

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Статус</span>
                  <Badge variant={status.variant}>{status.label}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Дата создания</span>
                  <span className="text-sm">{formatDate(order.created_at)}</span>
                </div>
                {order.customer_name && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Имя</span>
                    <span className="text-sm">{order.customer_name}</span>
                  </div>
                )}
                {order.customer_phone && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Телефон</span>
                    <span className="text-sm">{order.customer_phone}</span>
                  </div>
                )}
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="font-semibold">Товары в заказе</h3>
                {orderItems.map((item) => (
                  <div key={item.id} className="flex items-center gap-3">
                    <div className="relative h-12 w-12 overflow-hidden rounded-lg bg-secondary">
                      <Image
                        src={item.product?.image_url || "/placeholder.svg?height=48&width=48"}
                        alt={item.product?.name || "Товар"}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium leading-tight">{item.product?.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {item.quantity} x {formatPrice(item.price_at_time)}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      {item.is_issued && (
                        <Badge variant="outline" className="gap-1 text-green-600">
                          <Check className="h-3 w-3" />
                          Выдано
                        </Badge>
                      )}
                      <span className="font-semibold">{formatPrice(item.price_at_time * item.quantity)}</span>
                    </div>
                  </div>
                ))}
              </div>

              <Separator />

              <div className="flex items-center justify-between text-lg font-bold">
                <span>Итого</span>
                <span className="text-accent">{formatPrice(order.total_amount)}</span>
              </div>

              <Link href="/" className="block">
                <Button variant="outline" className="w-full gap-2 bg-transparent">
                  <Home className="h-4 w-4" />
                  Вернуться в каталог
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
