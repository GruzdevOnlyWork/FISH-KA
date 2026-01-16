"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { createClient } from "@/lib/supabase/client"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Plus, Pencil, Trash2, Search, Package, X, PlusCircle, Trash } from "lucide-react"
import type { Product, ProductWithCategories,  Category } from "@/lib/types"

interface ProductsManagerProps {
  initialProducts: ProductWithCategories[]
  categories: Category[]
}

interface ProductAttribute {
  id?: string
  name: string
  value: string
  data_type: 'text' | 'number' | 'boolean'
  unit?: string
}

type ProductFormData = {
  name: string
  description: string
  price: string
  image_url: string
  category_ids: string[] 
  in_stock: boolean
  stock_quantity: string
  brand: string
  attributes: ProductAttribute[]
}

const emptyFormData: ProductFormData = {
  name: "",
  description: "",
  price: "",
  image_url: "",
  category_ids: [],
  in_stock: true,
  stock_quantity: "0",
  brand: "",
  attributes: []
}

export function ProductsManager({ initialProducts, categories }: ProductsManagerProps) {
  const [products, setProducts] = useState(initialProducts)
  const [search, setSearch] = useState("")
  const [categoryFilter, setCategoryFilter] = useState<string>("all")
  const [isLoading, setIsLoading] = useState(false)
  const [editingProduct, setEditingProduct] = useState<ProductWithCategories | null>(null)
  const [formData, setFormData] = useState<ProductFormData>(emptyFormData)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const router = useRouter()

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("ru-RU", {
      style: "currency",
      currency: "RUB",
      maximumFractionDigits: 0,
    }).format(price)
  }

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(search.toLowerCase()) ||
      product.brand?.toLowerCase().includes(search.toLowerCase())

    const matchesCategory = categoryFilter === "all" || 
      product.categories?.some(cat => cat.category_id === categoryFilter)

    return matchesSearch && matchesCategory
  })

  const addAttribute = () => {
    setFormData(prev => ({
      ...prev,
      attributes: [...prev.attributes, { name: '', value: '', data_type: 'text' }]
    }))
  }

  const removeAttribute = (index: number) => {
    setFormData(prev => ({
      ...prev,
      attributes: prev.attributes.filter((_, i) => i !== index)
    }))
  }

  const updateAttribute = (index: number, field: keyof ProductAttribute, value: string) => {
    setFormData(prev => ({
      ...prev,
      attributes: prev.attributes.map((attr, i) => 
        i === index ? { ...attr, [field]: value } : attr
      )
    }))
  }

  const toggleCategory = (categoryId: string) => {
    setFormData(prev => ({
      ...prev,
      category_ids: prev.category_ids.includes(categoryId)
        ? prev.category_ids.filter(id => id !== categoryId)
        : [...prev.category_ids, categoryId]
    }))
  }

  const handleOpenCreate = () => {
    setEditingProduct(null)
    setFormData(emptyFormData)
    setIsDialogOpen(true)
  }

  const handleOpenEdit = async (product: ProductWithCategories) => {
    setIsLoading(true)
    try {
      const supabase = createClient()
      
      const { data: attributes } = await supabase
        .from('product_attributes')
        .select('*')
        .eq('product_id', product.id)

      const { data: productCategories } = await supabase
        .from('product_categories')
        .select('category_id')
        .eq('product_id', product.id)

      const categoryIds = productCategories?.map(pc => pc.category_id) || []

      setEditingProduct(product)
      setFormData({
        name: product.name,
        description: product.description || "",
        price: product.price.toString(),
        image_url: product.image_url || "",
        category_ids: categoryIds,
        in_stock: product.in_stock || false,
        stock_quantity: product.stock_quantity?.toString() || "0",
        brand: product.brand || "",
        attributes: attributes || []
      })
    } catch (error) {
      console.error('Ошибка загрузки данных:', error)
    } finally {
      setIsLoading(false)
    }
    setIsDialogOpen(true)
  }

  const handleSave = async () => {
    setIsLoading(true)
    try {
      const supabase = createClient()

      const productData = {
        name: formData.name,
        description: formData.description || null,
        price: Number.parseFloat(formData.price),
        image_url: formData.image_url || null,
        in_stock: formData.in_stock,
        stock_quantity: Number.parseInt(formData.stock_quantity) || 0,
        brand: formData.brand || null,
        updated_at: new Date().toISOString(),
      }

      let productId: string

      if (editingProduct) {
        const { data, error } = await supabase
          .from("products")
          .update(productData)
          .eq("id", editingProduct.id)
          .select()
          .single()

        if (error) throw error
        productId = editingProduct.id
      } else {
        const { data, error } = await supabase
          .from("products")
          .insert(productData)
          .select()
          .single()

        if (error) throw error
        productId = data!.id
      }

      await supabase
        .from('product_categories')
        .delete()
        .eq('product_id', productId)

      if (formData.category_ids.length > 0) {
        const categoryLinks = formData.category_ids.map(category_id => ({
          product_id: productId,
          category_id
        }))

        const { error: categoryError } = await supabase
          .from('product_categories')
          .insert(categoryLinks)

        if (categoryError) throw categoryError
      }

      if (formData.attributes.length > 0) {
        await supabase
          .from('product_attributes')
          .delete()
          .eq('product_id', productId)

        const attributesToInsert = formData.attributes.map(attr => ({
          product_id: productId,
          name: attr.name,
          value: attr.value,
          data_type: attr.data_type,
          unit: attr.unit || null
        }))

        const { error: attrError } = await supabase
          .from('product_attributes')
          .insert(attributesToInsert)

        if (attrError) throw attrError
      }

      setIsDialogOpen(false)
      router.refresh()

      const { data: updatedProducts } = await supabase
        .from("products")
        .select("*, category:categories(*)")
        .order("created_at", { ascending: false })

      if (updatedProducts) {
        setProducts(updatedProducts)
      }

    } catch (error) {
      console.error("[v0] Error saving product:", error)
      alert("Ошибка сохранения: " + (error as Error).message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (productId: string) => {
    if (!confirm("Вы уверены, что хотите удалить этот товар? Это удалит также все категории и атрибуты.")) return

    setIsLoading(true)
    try {
      const supabase = createClient()
      
      const { error } = await supabase
        .from("products")
        .delete()
        .eq("id", productId)

      if (error) throw error

      setProducts((prev) => prev.filter((p) => p.id !== productId))
      router.refresh()
    } catch (error) {
      console.error("[v0] Error deleting product:", error)
      alert("Ошибка удаления: " + (error as Error).message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <CardTitle>Каталог товаров ({filteredProducts.length})</CardTitle>
            <div className="flex gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Поиск товаров..."
                  className="w-48 pl-10"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Категория" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Все категории</SelectItem>
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button onClick={handleOpenCreate} className="gap-2">
                <Plus className="h-4 w-4" />
                Добавить
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filteredProducts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
              <Package className="mb-4 h-12 w-12" />
              <p>Товары не найдены</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-16">Фото</TableHead>
                  <TableHead>Название</TableHead>
                  <TableHead>Категории</TableHead>
                  <TableHead>Цена</TableHead>
                  <TableHead>Наличие</TableHead>
                  <TableHead className="text-right">Действия</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProducts.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell>
                      <div className="relative h-12 w-12 overflow-hidden rounded-lg bg-secondary">
                        <Image
                          src={product.image_url || "/placeholder.svg?height=48&width=48"}
                          alt={product.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{product.name}</p>
                        {product.brand && <p className="text-sm text-muted-foreground">{product.brand}</p>}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {product.categories && product.categories.length > 0 ? (
                          product.categories.map((catLink) => (
                            <Badge key={catLink.category_id} variant="outline" className="text-xs">
                              {catLink.categories.name}
                            </Badge>
                          ))
                        ) : (
                          <span className="text-muted-foreground text-sm">—</span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="font-semibold">{formatPrice(product.price)}</TableCell>
                    <TableCell>
                      {product.in_stock ? (
                        <Badge variant="default">В наличии ({product.stock_quantity})</Badge>
                      ) : (
                        <Badge variant="destructive">Нет в наличии</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon" onClick={() => handleOpenEdit(product)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-destructive hover:text-destructive"
                          onClick={() => handleDelete(product.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingProduct ? "Редактировать товар" : "Добавить товар"}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Название</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                placeholder="Shimano Nasci 2500"
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="description">Описание</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                placeholder="Описание товара..."
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="price">Цена (руб.)</Label>
                <Input
                  id="price"
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData((prev) => ({ ...prev, price: e.target.value }))}
                  placeholder="5000"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="brand">Бренд</Label>
                <Input
                  id="brand"
                  value={formData.brand}
                  onChange={(e) => setFormData((prev) => ({ ...prev, brand: e.target.value }))}
                  placeholder="Shimano"
                />
              </div>
            </div>

            <div className="grid gap-2">
              <Label>Категории <span className="text-sm text-muted-foreground">(можно выбрать несколько)</span></Label>
              <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto p-2 border rounded-md bg-background">
                {categories.map((cat) => (
                  <div key={cat.id} className="flex items-center gap-2 p-2 hover:bg-accent rounded">
                    <Switch
                      id={`cat-${cat.id}`}
                      checked={formData.category_ids.includes(cat.id)}
                      onCheckedChange={() => toggleCategory(cat.id)}
                    />
                    <Label htmlFor={`cat-${cat.id}`} className="cursor-pointer flex-1 text-sm">
                      {cat.icon && <span className="mr-2">{cat.icon}</span>}
                      {cat.name}
                    </Label>
                  </div>
                ))}
              </div>
              {formData.category_ids.length > 0 && (
                <p className="text-sm text-muted-foreground mt-1">
                  Выбрано: {formData.category_ids.length} {formData.category_ids.length === 1 ? 'категория' : 'категорий'}
                </p>
              )}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="image_url">URL изображения</Label>
              <Input
                id="image_url"
                value={formData.image_url}
                onChange={(e) => setFormData((prev) => ({ ...prev, image_url: e.target.value }))}
                placeholder="https://example.com/image.jpg"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="stock_quantity">Количество на складе</Label>
                <Input
                  id="stock_quantity"
                  type="number"
                  value={formData.stock_quantity}
                  onChange={(e) => setFormData((prev) => ({ ...prev, stock_quantity: e.target.value }))}
                />
              </div>
              <div className="flex items-center gap-2 pt-6">
                <Switch
                  id="in_stock"
                  checked={formData.in_stock}
                  onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, in_stock: checked }))}
                />
                <Label htmlFor="in_stock">В наличии</Label>
              </div>
            </div>
          </div>

          <div className="border-t pt-6">
            <div className="flex items-center justify-between mb-4">
              <Label className="text-lg font-semibold">Характеристики</Label>
              <Button 
                type="button" 
                variant="outline" 
                size="sm"
                onClick={addAttribute}
              >
                <PlusCircle className="h-4 w-4 mr-1" />
                Добавить
              </Button>
            </div>

            <div className="space-y-3 max-h-64 overflow-y-auto">
              {formData.attributes.map((attr, index) => (
                <div key={attr.id || index} className="flex gap-3 items-start p-3 border rounded-lg">
                  <div className="flex-1 space-y-2">
                    <Input
                      placeholder="Название (Длина, Вес, Тест...)"
                      value={attr.name}
                      onChange={(e) => updateAttribute(index, 'name', e.target.value)}
                    />
                    <div className="flex gap-2">
                      <Input
                        placeholder="Значение"
                        value={attr.value}
                        onChange={(e) => updateAttribute(index, 'value', e.target.value)}
                        className="flex-1"
                      />
                      <Input
                        placeholder="ед."
                        value={attr.unit || ''}
                        onChange={(e) => updateAttribute(index, 'unit', e.target.value)}
                        className="w-16"
                      />
                    </div>
                  </div>
                  
                  <Select
                    value={attr.data_type}
                    onValueChange={(value) => updateAttribute(index, 'data_type', value as any)}
                  >
                    <SelectTrigger className="w-24">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="text">Текст</SelectItem>
                      <SelectItem value="number">Число</SelectItem>
                      <SelectItem value="boolean">Логическое</SelectItem>
                    </SelectContent>
                  </Select>

                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeAttribute(index)}
                    className="h-8 w-8 p-0"
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Отмена</Button>
            </DialogClose>
            <Button 
              onClick={handleSave} 
              disabled={isLoading || !formData.name || !formData.price}
            >
              {isLoading ? "Сохранение..." : "Сохранить"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
