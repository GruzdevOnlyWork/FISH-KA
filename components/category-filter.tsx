"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import type { Category } from "@/lib/types"
import { cn } from "@/lib/utils"
import { Anchor, Target, Settings, Shirt, Briefcase, Fish, Package, Waves } from "lucide-react"

interface CategoryFilterProps {
  categories: Category[]
  selectedCategory: string | null
  onSelectCategory: (slug: string | null) => void
}

const iconMap: Record<string, React.ReactNode> = {
  "🎣": <Fish className="h-4 w-4" />,
  "🐟": <Fish className="h-4 w-4" />,
  "🪱": <Target className="h-4 w-4" />,
  "🌊": <Waves className="h-4 w-4" />,
  "🎋": <Anchor className="h-4 w-4" />,
  "🔄": <Settings className="h-4 w-4" />,
  "🧵": <Anchor className="h-4 w-4" />,
  "🪝": <Anchor className="h-4 w-4" />,
  "🎯": <Target className="h-4 w-4" />,
  "🥫": <Package className="h-4 w-4" />,
  "🧥": <Shirt className="h-4 w-4" />,
  "🎒": <Briefcase className="h-4 w-4" />,
  "🔧": <Settings className="h-4 w-4" />,
}

export function CategoryFilter({ categories, selectedCategory, onSelectCategory }: CategoryFilterProps) {
  return (
    <TooltipProvider delayDuration={200}>
      <div className="w-full">
        <div className="flex flex-wrap gap-2 pb-4">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant={selectedCategory === null ? "default" : "outline"}
                size="sm"
                onClick={() => onSelectCategory(null)}
                className={cn(selectedCategory === null && "bg-primary text-primary-foreground")}
              >
                Все товары
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Показать все категории товаров</p>
            </TooltipContent>
          </Tooltip>
          {categories.map((category) => (
            <Tooltip key={category.id}>
              <TooltipTrigger asChild>
                <Button
                  variant={selectedCategory === category.slug ? "default" : "outline"}
                  size="sm"
                  onClick={() => onSelectCategory(category.slug)}
                  className={cn("gap-2", selectedCategory === category.slug && "bg-primary text-primary-foreground")}
                >
                  {category.icon && iconMap[category.icon]}
                  {category.name}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{category.description || category.name}</p>
              </TooltipContent>
            </Tooltip>
          ))}
        </div>
      </div>
    </TooltipProvider>
  )
}
