"use client"

import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ShoppingCart, Ruler, Tag, CheckCircle, Clock, MapPin, Check } from "lucide-react"
import { useCartStore } from "@/lib/cart-store"
import { useState } from "react"
import Link from "next/link"

interface ProductAttribute {
  id: string
  name: string
  value: string
  data_type: 'text' | 'number' | 'boolean'
  unit?: string
}

interface ProductCategoryLink {
  category_id: string
  categories: {
    id: string
    name: string
    slug: string
    icon: string
  }
}

interface ProductPublicDetailsProps {
  product: any
  attributes: ProductAttribute[]
}

export function ProductPublicDetails({ product, attributes }: ProductPublicDetailsProps) {
  const addItem = useCartStore((state) => state.addItem)
  const items = useCartStore((state) => state.items)
  const [isAdding, setIsAdding] = useState(false)

  const isInCart = items.some((item) => item.product.id === product.id)
  
  const handleAddToCart = () => {
    setIsAdding(true)
    addItem(product)
    setTimeout(() => setIsAdding(false), 1000)
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("ru-RU", {
      style: "currency",
      currency: "RUB",
      maximumFractionDigits: 0,
    }).format(price)
  }

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Link 
            href="/"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <span className="w-4 h-4 rotate-180">→</span>
            На главную
          </Link>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Изображение + цена + кнопка */}
          <div className="space-y-6">
            <div className="relative h-96 w-full rounded-2xl overflow-hidden bg-secondary/50 shadow-xl">
              <Image
                src={product.image_url || "/placeholder.svg?height=500&width=500"}
                alt={product.name}
                fill
                className="object-cover"
              />
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-2xl">
                  <Tag className="h-7 w-7 text-primary" />
                  {product.name}
                </CardTitle>
                {product.brand && (
                  <Badge variant="secondary" className="text-lg">
                    {product.brand}
                  </Badge>
                )}
              </CardHeader>
              
              <CardContent className="space-y-6 pt-6">
                <div className="space-y-4">
                  <div className="flex items-baseline gap-3">
                    <span className="text-4xl font-bold text-accent">
                      {formatPrice(product.price)}
                    </span>
                    <span className="text-sm text-muted-foreground">за единицу</span>
                  </div>

                  <div className="flex items-center gap-3">
                    {product.in_stock ? (
                      <>
                        <Badge className="gap-1 bg-green-100 text-green-800 hover:bg-green-200">
                          <CheckCircle className="h-4 w-4" />
                          В наличии ({product.stock_quantity})
                        </Badge>
                      </>
                    ) : (
                      <Badge variant="destructive" className="text-lg">
                        Нет в наличии
                      </Badge>
                    )}
                  </div>
                </div>
                <Button
                  size="lg"
                  className="w-full h-14 text-lg gap-3 shadow-lg"
                  onClick={handleAddToCart}
                  disabled={!product.in_stock || isAdding}
                  variant={isInCart ? "secondary" : "default"}
                >
                  {isAdding ? (
                    <>
                      <Check className="h-5 w-5 animate-pulse" />
                      Добавлено!
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="h-5 w-5" />
                      {isInCart ? "Уже в корзине" : "Добавить в корзину"}
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>
          <div className="space-y-6 lg:sticky lg:top-8">

            {product.description && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Ruler className="h-5 w-5" />
                    Описание
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <p className="whitespace-pre-wrap text-muted-foreground leading-relaxed">
                    {product.description}
                  </p>
                </CardContent>
              </Card>
            )}
            {attributes.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Ruler className="h-5 w-5" />
                    Характеристики ({attributes.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Характеристика</TableHead>
                        <TableHead>Значение</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {attributes.map((attr) => (
                        <TableRow key={attr.id}>
                          <TableCell className="font-medium capitalize">{attr.name}</TableCell>
                          <TableCell>
                            <span className="font-semibold">
                              {attr.value}
                              {attr.unit && <span className="ml-1 text-muted-foreground">({attr.unit})</span>}
                            </span>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            )}

            {product.categories && product.categories.length > 0 ? (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    Категории ({product.categories.length})
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="flex flex-wrap gap-2">
                    {product.categories.map((catLink: ProductCategoryLink) => (
                      <Badge key={catLink.category_id} variant="outline" className="text-sm">
                        {catLink.categories.name}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle>Категория</CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <span className="text-muted-foreground">Без категории</span>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
