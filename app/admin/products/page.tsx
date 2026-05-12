import { createClient } from "@/lib/supabase/server"
import { ProductsManager } from "@/components/admin/products-manager"

export default async function ProductsPage() {
  const supabase = await createClient()

  const [{ data: rawProducts }, { data: categories }] = await Promise.all([
    supabase.from("products").select("*, product_categories(category_id, categories:categories(id, name, slug, icon))").order("created_at", { ascending: false }),
    supabase.from("categories").select("*").order("name"),
  ])

  const products = rawProducts?.map((product: any) => ({
    ...product,
    categories: product.product_categories?.map((pc: any) => ({
      category_id: pc.categories.id,
      categories: pc.categories
    })) || []
  })) || []

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Товары</h1>
        <p className="text-muted-foreground">Управление каталогом товаров</p>
      </div>

      <ProductsManager initialProducts={products} categories={categories || []} />
    </div>
  )
}
