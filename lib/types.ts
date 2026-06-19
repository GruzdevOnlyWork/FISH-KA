export interface Category {
  id: string
  name: string
  slug: string
  icon: string | null
  description: string | null
  created_at: string
}

export interface Product {
  id: string
  name: string
  description: string | null
  price: number
  image_url: string | null
  category_id: string | null
  in_stock: boolean
  stock_quantity: number
  brand: string | null
  created_at: string
  updated_at: string
  category?: Category
}

export interface Order {
  id: string
  qr_code: string
  status: "pending" | "completed" | "cancelled"
  customer_name: string | null
  customer_phone: string | null
  total_amount: number
  created_at: string
  updated_at: string
}

export interface OrderItem {
  id: string
  order_id: string
  product_id: string
  quantity: number
  price_at_time: number
  is_issued: boolean
  created_at: string
  product?: Product
}

export interface CartItem {
  product: Product
  quantity: number
}

export interface ProductCategoryLink {
  category_id: string
  categories: {
    id: string
    name: string
    slug: string
    icon: string
  }
}

export interface ProductWithCategories extends Product {
  categories?: ProductCategoryLink[]
}

export interface ProductCategoryLink {
  category_id: string
  categories: {
    id: string
    name: string
    slug: string
    icon: string
  }
}

export interface ProductWithCategories extends Product {
  categories?: ProductCategoryLink[]
}