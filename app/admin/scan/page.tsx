import { Suspense } from "react"
import { ScannerForm } from "@/components/admin/scanner-form"

export default function ScanPage() {
  return (
    <Suspense fallback={null}>
      <ScannerForm />
    </Suspense>
  )
}
