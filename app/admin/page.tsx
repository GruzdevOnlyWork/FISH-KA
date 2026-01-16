import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Package, ShoppingCart, Clock, CheckCircle } from "lucide-react"

export default async function AdminDashboard() {
  const supabase = await createClient()

  const [{ count: productsCount }, { count: ordersCount }, { count: pendingCount }, { count: completedCount }] =
    await Promise.all([
      supabase.from("products").select("*", { count: "exact", head: true }),
      supabase.from("orders").select("*", { count: "exact", head: true }),
      supabase.from("orders").select("*", { count: "exact", head: true }).eq("status", "pending"),
      supabase.from("orders").select("*", { count: "exact", head: true }).eq("status", "completed"),
    ])

  const stats = [
    {
      title: "Товаров",
      value: productsCount || 0,
      icon: Package,
      color: "text-primary",
      bg: "bg-primary/10",
    },
    {
      title: "Всего заказов",
      value: ordersCount || 0,
      icon: ShoppingCart,
      color: "text-accent",
      bg: "bg-accent/10",
    },
    {
      title: "Ожидают выдачи",
      value: pendingCount || 0,
      icon: Clock,
      color: "text-yellow-600",
      bg: "bg-yellow-100",
    },
    {
      title: "Выполнено",
      value: completedCount || 0,
      icon: CheckCircle,
      color: "text-green-600",
      bg: "bg-green-100",
    },
  ]

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Панель управления</h1>
        <p className="text-muted-foreground">Добро пожаловать в админ-панель FISH-KA</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
              <div className={`rounded-lg p-2 ${stat.bg}`}>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
