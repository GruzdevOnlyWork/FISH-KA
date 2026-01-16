"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { useCartStore } from "@/lib/cart-store"
import { Minus, Plus, Trash2, ShoppingBag, ArrowLeft, QrCode } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"

export default function CartPage() {
  const { items, updateQuantity, removeItem, clearCart, getTotalPrice } = useCartStore()
  const [customerName, setCustomerName] = useState("")
  const [customerPhone, setCustomerPhone] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [mounted, setMounted] = useState(false)
  const router = useRouter()

  useEffect(() => {
    setMounted(true)
  }, [])

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("ru-RU", {
      style: "currency",
      currency: "RUB",
      maximumFractionDigits: 0,
    }).format(price)
  }

  const handleCreateOrder = async () => {
    if (items.length === 0) return

    setIsLoading(true)
    try {
      const supabase = createClient()

      const qrCode = `FISHKA-${Date.now()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`

      const { data: order, error: orderError } = await supabase
        .from("orders")
        .insert({
          qr_code: qrCode,
          customer_name: customerName || null,
          customer_phone: customerPhone || null,
          total_amount: getTotalPrice(),
          status: "pending",
        })
        .select()
        .single()

      if (orderError) throw orderError

      const orderItems = items.map((item) => ({
        order_id: order.id,
        product_id: item.product.id,
        quantity: item.quantity,
        price_at_time: item.product.price,
        is_issued: false,
      }))

      const { error: itemsError } = await supabase.from("order_items").insert(orderItems)

      if (itemsError) throw itemsError
      clearCart()
      router.push(`/order/${qrCode}`)
    } catch (error) {
      console.error("[v0] Error creating order:", error)
      alert("Ошибка при создании заказа. Попробуйте ещё раз.")
    } finally {
      setIsLoading(false)
    }
  }

  if (!mounted) {
    return null
  }

  return (
    <div className="min-h-screen">
      <Header />

      <main className="container mx-auto px-4 py-6">
        <div className="mb-6">
          <Link href="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4" />
            Вернуться в каталог
          </Link>
          <h1 className="mt-4 text-2xl font-bold md:text-3xl">Корзина</h1>
        </div>

        {items.length === 0 ? (
          <Card className="mx-auto max-w-md">
            <CardContent className="flex flex-col items-center py-12">
              <ShoppingBag className="h-16 w-16 text-muted-foreground" />
              <h2 className="mt-4 text-xl font-semibold">Корзина пуста</h2>
              <p className="mt-2 text-center text-muted-foreground">
                Добавьте товары из каталога, чтобы оформить заказ
              </p>
              <Link href="/" className="mt-6">
                <Button>Перейти в каталог</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Товары в корзине ({items.length})</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {items.map((item) => (
                    <div key={item.product.id} className="flex gap-4">
                      <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg bg-secondary">
                        <Image
                          src={item.product.image_url || "/placeholder.svg?height=80&width=80"}
                          alt={item.product.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex flex-1 flex-col justify-between">
                        <div>
                          <h3 className="font-medium leading-tight">{item.product.name}</h3>
                          <p className="text-sm text-muted-foreground">{formatPrice(item.product.price)}</p>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8 bg-transparent"
                              onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                            >
                              <Minus className="h-4 w-4" />
                            </Button>
                            <span className="w-8 text-center">{item.quantity}</span>
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8 bg-transparent"
                              onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                            >
                              <Plus className="h-4 w-4" />
                            </Button>
                          </div>
                          <div className="flex items-center gap-4">
                            <span className="font-semibold">{formatPrice(item.product.price * item.quantity)}</span>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-destructive hover:text-destructive"
                              onClick={() => removeItem(item.product.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            <div className="lg:col-span-1">
              <Card className="sticky top-24">
                <CardHeader>
                  <CardTitle>Оформление заказа</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Ваше имя (необязательно)</Label>
                    <Input
                      id="name"
                      placeholder="Иван"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Телефон (необязательно)</Label>
                    <Input
                      id="phone"
                      placeholder="+7 (999) 123-45-67"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                    />
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Товары ({items.length})</span>
                      <span>{formatPrice(getTotalPrice())}</span>
                    </div>
                    <div className="flex justify-between font-semibold">
                      <span>Итого</span>
                      <span className="text-xl text-accent">{formatPrice(getTotalPrice())}</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="w-full gap-2" size="lg" onClick={handleCreateOrder} disabled={isLoading}>
                    <QrCode className="h-5 w-5" />
                    {isLoading ? "Создание заказа..." : "Создать QR заказа"}
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
