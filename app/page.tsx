import { createClient } from "@/lib/supabase/server"
import { Catalog } from "@/components/catalog"

export default async function HomePage() {
  const supabase = await createClient()

  const [{ data: rawProducts }, { data: categories }] = await Promise.all([
    supabase
      .from("products")
      .select(`
        *,
        product_categories (
          categories:categories(id, name, slug, icon)
        )
      `)
      .order("created_at", { ascending: false }),
    supabase.from("categories").select("*").order("name"),
  ])
  const productsWithCategories = rawProducts?.map((product: any) => ({
    ...product,
    categories: product.product_categories?.map((pc: any) => ({
      category_id: pc.categories.id,
      categories: pc.categories
    })) || []
  })) || []

  return (
    <Catalog 
      initialProducts={productsWithCategories} 
      categories={categories || []} 
    />
  )
}
