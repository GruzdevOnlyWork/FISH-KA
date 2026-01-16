import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import { OrderDetails } from "@/components/order-details"

interface OrderPageProps {
  params: Promise<{ qrCode: string }>
}

export default async function OrderPage({ params }: OrderPageProps) {
  const { qrCode } = await params
  const supabase = await createClient()

  const { data: order, error: orderError } = await supabase.from("orders").select("*").eq("qr_code", qrCode).single()

  if (orderError || !order) {
    notFound()
  }

  const { data: orderItems } = await supabase
    .from("order_items")
    .select(`
      *,
      product:products(*)
    `)
    .eq("order_id", order.id)

  return <OrderDetails order={order} orderItems={orderItems || []} />
}
