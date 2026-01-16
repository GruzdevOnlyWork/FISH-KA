import { createClient } from "@/lib/supabase/server"
import { ProductsManager } from "@/components/admin/products-manager"

export default async function ProductsPage() {
  const supabase = await createClient()

  const [{ data: products }, { data: categories }] = await Promise.all([
    supabase.from("products").select("*, category:categories(*)").order("created_at", { ascending: false }),
    supabase.from("categories").select("*").order("name"),
  ])

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Товары</h1>
        <p className="text-muted-foreground">Управление каталогом товаров</p>
      </div>

      <ProductsManager initialProducts={products || []} categories={categories || []} />
    </div>
  )
}
