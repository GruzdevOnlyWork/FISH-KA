"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function issueOrderItem(formData: FormData) {
  const orderItemId = formData.get("orderItemId") as string
  const qrCode = formData.get("qrCode") as string

  console.log('Выдача:', orderItemId)

  const supabase = await createClient()

  const { data: orderItem } = await supabase
    .from("order_items")
    .select("quantity, product_id, is_issued")
    .eq("id", orderItemId)
    .single()

  if (!orderItem || orderItem.is_issued) {
    throw new Error("Позиция уже выдана")
  }

  const { data, error } = await supabase
    .rpc("issue_product_stock", {
      p_product_id: orderItem.product_id,
      p_quantity: orderItem.quantity
    })

  console.log(' Склад:', { data, error })

  if (error) {
    throw new Error(error.message)
  }

  await supabase
    .from("order_items")
    .update({ is_issued: true })
    .eq("id", orderItemId)

  revalidatePath(`/admin/orders/${qrCode}`)
}

export async function issueAllOrderItems(formData: FormData) {
  const orderId = formData.get("orderId") as string
  const qrCode = formData.get("qrCode") as string

  if (!orderId || !qrCode) {
    throw new Error("ID заказа или QR-код не указаны")
  }

  const supabase = await createClient()

  const { data: unissuedItems } = await supabase
    .from("order_items")
    .select("id, product_id, quantity")
    .eq("order_id", orderId)
    .eq("is_issued", false)

  if (!unissuedItems || unissuedItems.length === 0) {
    throw new Error("Нет невыданных позиций")
  }

  for (const item of unissuedItems) {
    const { data: productItem, error: itemError } = await supabase
      .from("order_items")
      .select("quantity, product_id")
      .eq("id", item.id)
      .single()

    if (productItem && !itemError) {
      await supabase.rpc("issue_product_stock", {
        p_product_id: item.product_id,
        p_quantity: item.quantity
      })

      await supabase
        .from("order_items")
        .update({ is_issued: true })
        .eq("id", item.id)
    }
  }

  await supabase
    .from("orders")
    .update({ 
      status: "completed",
      updated_at: new Date().toISOString()
    })
    .eq("id", orderId)


  revalidatePath(`/admin/orders/${qrCode}`)
  revalidatePath('/admin/orders')
}
