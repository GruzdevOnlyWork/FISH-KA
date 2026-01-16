"use client"

import { useState, useTransition, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { QRCodeSVG } from "qrcode.react"
import type { Order, OrderItem, Product } from "@/lib/types" 
import { ArrowLeft, Check, Package, User, Phone, Calendar, Clock } from "lucide-react"
import { issueOrderItem , issueAllOrderItems } from "@/app/admin/orders/actions" 

interface AdminOrderDetailsProps {
  order: Order
  orderItems: (OrderItem & { product: Product })[]
}

const statusConfig = {
  pending: { label: "Ожидает выдачи", variant: "secondary" as const },
  completed: { label: "Выполнен", variant: "default" as const },
  cancelled: { label: "Отменён", variant: "destructive" as const },
}

export function AdminOrderDetails({ order: initialOrder, orderItems: initialItems }: AdminOrderDetailsProps) {
  const [order, setOrder] = useState(initialOrder)
  const [orderItems, setOrderItems] = useState(initialItems)
  const [isPending, startTransition] = useTransition()
  const [isUpdating, setIsUpdating] = useState(false)
  const [isClient, setIsClient] = useState(false)
  const router = useRouter()


  useEffect(() => {
    setIsClient(true)
  }, [])

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

  const refreshOrderData = async () => {
    const supabase = createClient()
    

    const { data: updatedItems } = await supabase
      .from("order_items")
      .select(`
        *,
        product:products(*)
      `)
      .eq("order_id", order.id)


    const { data: updatedOrder } = await supabase
      .from("orders")
      .select("*")
      .eq("id", order.id)
      .single()

    if (updatedItems) {
      setOrderItems(updatedItems)
    }
    if (updatedOrder) {
      setOrder(updatedOrder)
    }
  }

  const handleIssueItem = async (itemId: string) => {
    setIsUpdating(true)
    
    try {
      const formData = new FormData()
      formData.append("orderItemId", itemId)
      formData.append("orderId", order.id)
      formData.append("qrCode", order.qr_code)

      await issueOrderItem(formData)

      const updatedItems = orderItems.map(item => 
        item.id === itemId 
          ? { ...item, is_issued: true }
          : item
      )
      setOrderItems(updatedItems)
      

      const issuedCount = updatedItems.filter(item => item.is_issued).length
      if (issuedCount === updatedItems.length) {
        setOrder(prev => ({ ...prev, status: 'completed' }))
      }

      router.refresh()
      
    } catch (error) {
      console.error("Ошибка выдачи:", error)
      alert("Ошибка при выдаче: " + (error as Error).message)
    } finally {

      setIsUpdating(false)
    }
  }

  const handleIssueAll = async () => {
    setIsUpdating(true)
    
    try {
      const formData = new FormData()
      formData.append("orderId", order.id)
      formData.append("qrCode", order.qr_code)


      await issueAllOrderItems(formData)

      setOrderItems(prev => prev.map(item => ({ ...item, is_issued: true })))
      setOrder(prev => ({ 
        ...prev, 
        status: 'completed',
        updated_at: new Date().toISOString()
      }))

      router.refresh()
      
    } catch (error) {
      console.error("Ошибка выдачи всех:", error)
      alert("Ошибка при выдаче всех товаров: " + (error as Error).message)
    } finally {
      setIsUpdating(false)
    }
  }

  const handleStatusChange = async (status: "pending" | "completed" | "cancelled") => {
    setIsUpdating(true)
    try {
      const supabase = createClient()
      const { error } = await supabase.from("orders").update({ status }).eq("id", order.id)

      if (error) throw error

      setOrder((prev) => ({ ...prev, status }))
      await refreshOrderData()
      router.refresh()
    } catch (error) {
      console.error("[v0] Error updating status:", error)
    } finally {
      setIsUpdating(false)
    }
  }

  const status = statusConfig[order.status]
  const issuedCount = orderItems.filter((item) => item.is_issued).length
  const totalCount = orderItems.length

  return (
    <div className="p-6">
      <div className="mb-6">
        <Link href="/admin/orders" className="mb-4 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" />
          Назад к заказам
        </Link>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Заказ {order.qr_code}</h1>
            <p className="text-muted-foreground">Создан {formatDate(order.created_at)}</p>
          </div>
          <Badge variant={status.variant} className="text-sm">
            {status.label}
          </Badge>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  Товары ({issuedCount}/{totalCount} выдано)
                </CardTitle>
                {order.status === "pending" && issuedCount < totalCount && isClient && ( 
                  <Button 
                    onClick={handleIssueAll} 
                    disabled={isUpdating || isPending}
                    size="sm"
                    className="flex items-center gap-2"
                  >
                    {isUpdating ? (
                      <>
                        <Clock className="h-4 w-4 animate-spin" />
                        Выдача...
                      </>
                    ) : (
                      <>
                        <Package className="h-4 w-4" />
                        Выдать все ({totalCount - issuedCount})
                      </>
                    )}
                  </Button>
                )}
              </CardHeader>
            <CardContent className="space-y-4">
              {orderItems.map((item) => (
                <div
                  key={item.id}
                  className={`flex items-center gap-4 rounded-lg border p-4 ${
                    item.is_issued ? "bg-green-50 border-green-200" : ""
                  }`}
                >
                  <div className="relative h-16 w-16 overflow-hidden rounded-lg bg-secondary">
                    <Image
                      src={item.product?.image_url || "/placeholder.svg?height=64&width=64"}
                      alt={item.product?.name || "Товар"}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium">{item.product?.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {item.quantity} x {formatPrice(item.price_at_time)}
                    </p>
                    {item.product?.stock_quantity !== undefined && (
                      <p className="text-xs text-muted-foreground">
                        Остаток: {item.product.stock_quantity}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="font-semibold">{formatPrice(item.price_at_time * item.quantity)}</span>
                    {item.is_issued ? (
                        <Badge variant="outline" className="gap-1 border-green-500 text-green-600">
                          <Check className="h-3 w-3" />
                          Выдано
                        </Badge>
                      ) : (
                        <Button
                          size="sm"
                          onClick={() => handleIssueItem(item.id)}
                          disabled={
                            isUpdating ||           // Общая загрузка
                            isPending ||            // Transition
                            order.status !== "pending" ||  // Заказ не pending
                            item.is_issued          // Этот товар уже выдан (дубль защиты)
                          }
                        >
                          {isPending ? "Выдача..." : "Выдать"}
                        </Button>
                      )}
                  </div>
                </div>
              ))}
              <Separator />
              <div className="flex justify-between text-lg font-bold">
                <span>Итого</span>
                <span className="text-accent">{formatPrice(order.total_amount)}</span>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>QR-код заказа</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center">
              <div className="rounded-xl bg-white p-4">
                <QRCodeSVG
                  value={`/admin/orders/${order.qr_code}`} 
                  size={150}
                  level="H"
                />
              </div>
              <p className="mt-2 font-mono text-sm text-muted-foreground">{order.qr_code}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Информация о клиенте</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <User className="h-4 w-4 text-muted-foreground" />
                <span>{order.customer_name || "Не указано"}</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span>{order.customer_phone || "Не указано"}</span>
              </div>
              <div className="flex items-center gap-3">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span>{formatDate(order.created_at)}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Управление статусом</CardTitle>
            </CardHeader>
            <CardContent>
              <Select
                value={order.status}
                onValueChange={(value) => handleStatusChange(value as "pending" | "completed" | "cancelled")}
                disabled={isUpdating || isPending}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      Ожидает выдачи
                    </div>
                  </SelectItem>
                  <SelectItem value="completed">
                    <div className="flex items-center gap-2">
                      <Check className="h-4 w-4" />
                      Выполнен
                    </div>
                  </SelectItem>
                  <SelectItem value="cancelled">
                    <div className="flex items-center gap-2 text-destructive">Отменён</div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
