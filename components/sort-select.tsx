"use client"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export type SortOption = "name-asc" | "name-desc" | "price-asc" | "price-desc" | "newest"

interface SortSelectProps {
  value: SortOption
  onChange: (value: SortOption) => void
}

export function SortSelect({ value, onChange }: SortSelectProps) {
  return (
    <Select value={value} onValueChange={(v) => onChange(v as SortOption)}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Сортировка" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="newest">Сначала новые</SelectItem>
        <SelectItem value="price-asc">Цена: по возрастанию</SelectItem>
        <SelectItem value="price-desc">Цена: по убыванию</SelectItem>
        <SelectItem value="name-asc">Название: А-Я</SelectItem>
        <SelectItem value="name-desc">Название: Я-А</SelectItem>
      </SelectContent>
    </Select>
  )
}
