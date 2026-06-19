import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import { ProductPublicDetails } from "@/components/public-product-details"
import { Metadata } from "next"

interface ProductPageProps {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { id } = await params
  const supabase = await createClient()
  
  const { data: product } = await supabase
    .from("products")
    .select("name")
    .eq("id", id)
    .single()

  return {
    title: product?.name ? `${product.name} - Fish-Ka` : "Товар - Fish-Ka"
  }
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params
  const supabase = await createClient()

  const { data: baseProduct } = await supabase
    .from("products")
    .select("*")
    .eq("id", id)
    .single()

  if (!baseProduct) {
    notFound()
  }

  const { data: productCategories } = await supabase
    .from("product_categories")
    .select("categories:categories(id, name, slug, icon)")
    .eq("product_id", id)

  const { data: attributes } = await supabase
    .from("product_attributes")
    .select("*")
    .eq("product_id", id)
    .order("name")

  const productWithCategories = {
    ...baseProduct,
    categories: productCategories?.map((pc: any) => ({
      category_id: pc.categories.id,
      categories: pc.categories
    })) || []
  } as any

  return (
    <ProductPublicDetails 
      product={productWithCategories} 
      attributes={attributes || []} 
    />
  )
}
