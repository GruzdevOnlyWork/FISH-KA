"use client"

import { useState, useMemo, useEffect } from "react"
import { Header } from "./header"
import { CategoryFilter } from "./category-filter"
import { ProductGrid } from "./product-grid"
import { SortSelect, type SortOption } from "./sort-select"
import { PriceFilter } from "./price-filter"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { ChevronDown, SlidersHorizontal } from "lucide-react"
import type { Product, Category } from "@/lib/types"

interface CatalogProps {
  initialProducts: (Product & { categories?: any[] })[] 
  categories: Category[]
}

export function Catalog({ initialProducts, categories }: CatalogProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [sortOption, setSortOption] = useState<SortOption>("newest")
  const [priceMin, setPriceMin] = useState<number | null>(null)
  const [priceMax, setPriceMax] = useState<number | null>(null)
  const [showFilters, setShowFilters] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const priceRange = useMemo(() => {
    const prices = initialProducts.map((p) => p.price)
    return {
      min: Math.min(...prices),
      max: Math.max(...prices),
    }
  }, [initialProducts])

  const filteredProducts = useMemo(() => {
    let products = [...initialProducts]

  if (selectedCategory) {
    const category = categories.find((c) => c.slug === selectedCategory)
    if (category) {
      products = products.filter((p) => 
        p.categories?.some((cat: any) => cat.category_id === category.id)
      )
    }
  }
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      products = products.filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          p.description?.toLowerCase().includes(query) ||
          p.brand?.toLowerCase().includes(query),
      )
    }

    if (priceMin !== null) {
      products = products.filter((p) => p.price >= priceMin)
    }
    if (priceMax !== null) {
      products = products.filter((p) => p.price <= priceMax)
    }

    switch (sortOption) {
      case "price-asc":
        products.sort((a, b) => a.price - b.price)
        break
      case "price-desc":
        products.sort((a, b) => b.price - a.price)
        break
      case "name-asc":
        products.sort((a, b) => a.name.localeCompare(b.name, "ru"))
        break
      case "name-desc":
        products.sort((a, b) => b.name.localeCompare(a.name, "ru"))
        break
      case "newest":
        products.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        break
    }

    return products
  }, [initialProducts, selectedCategory, searchQuery, sortOption, priceMin, priceMax, categories])

  const handlePriceChange = (min: number | null, max: number | null) => {
    setPriceMin(min)
    setPriceMax(max)
  }

  const activeFiltersCount = [selectedCategory, priceMin, priceMax, searchQuery].filter(Boolean).length

  if (!mounted) {
    return null
  }

  return (
    <div className="min-h-screen">
      <Header onSearch={setSearchQuery} searchQuery={searchQuery} />

      <main className="container mx-auto px-4 py-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold md:text-3xl">Каталог товаров</h1>
          <p className="mt-1 text-muted-foreground">
            {filteredProducts.length} товаров
            {activeFiltersCount > 0 && (
              <Badge variant="secondary" className="ml-2">
                {activeFiltersCount} фильтров
              </Badge>
            )}
          </p>
        </div>

        <div className="mb-6 space-y-4">
          <CategoryFilter
            categories={categories}
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
          />

          <div className="flex flex-wrap items-center justify-between gap-4">
            <Collapsible open={showFilters} onOpenChange={setShowFilters}>
              <CollapsibleTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                  <SlidersHorizontal className="h-4 w-4" />
                  Фильтры
                  <ChevronDown className={`h-4 w-4 transition-transform ${showFilters ? "rotate-180" : ""}`} />
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="mt-4">
                <PriceFilter
                  minPrice={priceRange.min}
                  maxPrice={priceRange.max}
                  currentMin={priceMin}
                  currentMax={priceMax}
                  onPriceChange={handlePriceChange}
                />
              </CollapsibleContent>
            </Collapsible>

            <SortSelect value={sortOption} onChange={setSortOption} />
          </div>
        </div>

        <ProductGrid products={filteredProducts} />
      </main>

    </div>
  )
}
