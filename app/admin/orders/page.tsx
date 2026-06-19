import { createClient } from "@/lib/supabase/server"
import { OrdersTable } from "@/components/admin/orders-table"

export default async function OrdersPage() {
  const supabase = await createClient()

  const { data: orders } = await supabase.from("orders").select("*").order("created_at", { ascending: false })

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Заказы</h1>
        <p className="text-muted-foreground">Управление заказами клиентов</p>
      </div>

      <OrdersTable initialOrders={orders || []} />
    </div>
  )
}
