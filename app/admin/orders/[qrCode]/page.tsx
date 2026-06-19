import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import { revalidatePath } from "next/cache"
import { AdminOrderDetails } from "@/components/admin/admin-order-details"

interface AdminOrderPageProps {
  params: Promise<{ qrCode: string }>
}

export default async function AdminOrderPage({ params }: AdminOrderPageProps) {
  const { qrCode } = await params
  const supabase = await createClient()

  const { data: order, error: orderError } = await supabase
    .from("orders")
    .select("*")
    .eq("qr_code", qrCode)
    .single()

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

  return <AdminOrderDetails order={order} orderItems={orderItems || []} />
}

export async function issueOrderItem(formData: FormData) {
  "use server"

  const orderItemId = formData.get("orderItemId") as string
  const orderId = formData.get("orderId") as string
  const qrCode = formData.get("qrCode") as string
  
  if (!orderItemId || !orderId || !qrCode) {
    throw new Error("ID заказа или позиции не указаны")
  }

  const supabase = await createClient()

  const { data: item, error: itemError } = await supabase
    .from("order_items")
    .select(`
      quantity,
      product_id,
      is_issued,
      product:products(stock_quantity)
    `)
    .eq("id", orderItemId)
    .single()

  if (itemError || !item || item.is_issued) {
    throw new Error("Позиция не найдена или уже выдана")
  }

  const productStock = Array.isArray(item.product) && item.product.length > 0 
    ? item.product[0]?.stock_quantity 
    : 0
  
  const currentStock = typeof productStock === 'number' ? productStock : 0
  const newStock = currentStock - item.quantity

  if (newStock < 0) {
    throw new Error(`Недостаточно товара на складе (осталось ${currentStock})`)
  }

  const { error: stockError } = await supabase
    .from("products")
    .update({
      stock_quantity: newStock,
      in_stock: newStock > 0,
      updated_at: new Date().toISOString()
    })
    .eq("id", item.product_id)

  if (stockError) {
    console.error("Ошибка обновления остатка:", stockError)
    throw new Error("Не удалось обновить остаток товара")
  }

  const { error: issueError } = await supabase
    .from("order_items")
    .update({ is_issued: true })
    .eq("id", orderItemId)

  if (issueError) {
    console.error("Ошибка пометки выдачи:", issueError)
    throw new Error("Не удалось отметить выдачу")
  }

  const { count: unissuedCount } = await supabase
    .from("order_items")
    .select("*")
    .eq("order_id", orderId)
    .eq("is_issued", false)

  if (unissuedCount === 0) {
    await supabase
      .from("orders")
      .update({ status: "completed" })
      .eq("id", orderId)
  }

  revalidatePath(`/admin/orders/[qrCode]`)
  revalidatePath(`/admin/orders/${qrCode}`)
}
