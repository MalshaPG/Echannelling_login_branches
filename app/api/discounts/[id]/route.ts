import { NextResponse } from "next/server"
import type { UpdateDiscountDto } from "@/types/discount"

// Shared mock collection (in a real app this would be a DB)
const discounts = [
  {
    id: "d1",
    code: "SUMMER2025",
    description: "Summer Special Discount",
    discountPercentage: 15,
    validFrom: "2025-06-01T00:00:00Z",
    validTo: "2025-08-31T23:59:59Z",
    status: "Active",
    createdAt: "2025-05-15T10:00:00Z",
    updatedAt: "2025-05-15T10:00:00Z",
  },
]

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const discount = discounts.find((d) => d.id === params.id)
  if (!discount) return NextResponse.json({ error: "Discount not found" }, { status: 404 })
  return NextResponse.json(discount)
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const data: UpdateDiscountDto = await request.json()
  const idx = discounts.findIndex((d) => d.id === params.id)
  if (idx === -1) return NextResponse.json({ error: "Discount not found" }, { status: 404 })

  discounts[idx] = {
    ...discounts[idx],
    ...data,
    updatedAt: new Date().toISOString(),
  }

  return NextResponse.json(discounts[idx])
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const idx = discounts.findIndex((d) => d.id === params.id)
  if (idx === -1) return NextResponse.json({ error: "Discount not found" }, { status: 404 })
  discounts.splice(idx, 1)
  return NextResponse.json({ success: true })
}