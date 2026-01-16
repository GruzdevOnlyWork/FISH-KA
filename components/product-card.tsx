"use client"

import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ShoppingCart, Check, Eye, Info } from "lucide-react"
import type { Product } from "@/lib/types"
import { useCartStore } from "@/lib/cart-store"
import { useState } from "react"

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const addItem = useCartStore((state) => state.addItem)
  const items = useCartStore((state) => state.items)
  const [isAdding, setIsAdding] = useState(false)

  const isInCart = items.some((item) => item.product.id === product.id)
  const cartItem = items.find((item) => item.product.id === product.id)

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation() 
    setIsAdding(true)
    addItem(product)
    setTimeout(() => setIsAdding(false), 500)
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("ru-RU", {
      style: "currency",
      currency: "RUB",
      maximumFractionDigits: 0,
    }).format(price)
  }

  return (
    <Link href={`/product/${product.id}`} className="block"> 
      <Card className="group flex flex-col overflow-hidden transition-all hover:shadow-xl hover:-translate-y-1 h-full">
        <div className="relative aspect-square overflow-hidden bg-secondary/50">
          <Image
            src={product.image_url || "/placeholder.svg?height=300&width=300"}
            alt={product.name}
            fill
            className="object-cover transition-transform group-hover:scale-105"
          />
          {!product.in_stock && (
            <div className="absolute inset-0 flex items-center justify-center bg-background/90 backdrop-blur-sm">
              <Badge variant="destructive" className="text-sm">
                Нет в наличии
              </Badge>
            </div>
          )}
          {product.brand && (
            <Badge variant="secondary" className="absolute left-2 top-2 z-10">
              {product.brand}
            </Badge>
          )}
        </div>
        
        <CardContent className="flex flex-1 flex-col gap-2 p-4">
          <h3 className="line-clamp-2 font-semibold leading-tight text-balance group-hover:text-primary transition-colors">
            {product.name}
          </h3>
          {product.description && (
            <p className="line-clamp-2 text-sm text-muted-foreground">{product.description}</p>
          )}
          <div className="mt-auto pt-2 flex items-center justify-between">
            <span className="text-xl font-bold text-accent">{formatPrice(product.price)}</span>
            <Badge variant="outline" className="gap-1 text-xs">
              <Info className="h-3 w-3" />
              Подробнее
            </Badge>
          </div>
        </CardContent>
        
        <CardFooter className="p-4 pt-0 border-t">
          <Button
            className="w-full gap-2"
            onClick={handleAddToCart}
            disabled={!product.in_stock || isAdding}
            variant={isInCart ? "secondary" : "default"}
          >
            {isAdding ? <Check className="h-4 w-4" /> : <ShoppingCart className="h-4 w-4" />}
            {isInCart ? `В корзине (${cartItem?.quantity})` : "В корзину"}
          </Button>
        </CardFooter>
      </Card>
    </Link>
  )
}
