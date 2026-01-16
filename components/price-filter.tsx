"use client"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"

interface PriceFilterProps {
  minPrice: number
  maxPrice: number
  currentMin: number | null
  currentMax: number | null
  onPriceChange: (min: number | null, max: number | null) => void
}

export function PriceFilter({ minPrice, maxPrice, currentMin, currentMax, onPriceChange }: PriceFilterProps) {
  const [localMin, setLocalMin] = useState(currentMin?.toString() || "")
  const [localMax, setLocalMax] = useState(currentMax?.toString() || "")

  useEffect(() => {
    setLocalMin(currentMin?.toString() || "")
    setLocalMax(currentMax?.toString() || "")
  }, [currentMin, currentMax])

  const handleApply = () => {
    const min = localMin ? Number(localMin) : null
    const max = localMax ? Number(localMax) : null
    onPriceChange(min, max)
  }

  const handleReset = () => {
    setLocalMin("")
    setLocalMax("")
    onPriceChange(null, null)
  }

  return (
    <div className="flex flex-wrap items-end gap-3">
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="min-price" className="text-sm">
          От
        </Label>
        <Input
          id="min-price"
          type="number"
          placeholder={minPrice.toString()}
          className="w-24"
          value={localMin}
          onChange={(e) => setLocalMin(e.target.value)}
        />
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="max-price" className="text-sm">
          До
        </Label>
        <Input
          id="max-price"
          type="number"
          placeholder={maxPrice.toString()}
          className="w-24"
          value={localMax}
          onChange={(e) => setLocalMax(e.target.value)}
        />
      </div>
      <Button variant="secondary" size="sm" onClick={handleApply}>
        Применить
      </Button>
      {(currentMin || currentMax) && (
        <Button variant="ghost" size="sm" onClick={handleReset}>
          Сбросить
        </Button>
      )}
    </div>
  )
}
