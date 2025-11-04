import { NextResponse } from "next/server"
import type { Discount, CreateDiscountDto } from "@/types/discount"

// Mock data
const discounts: Discount[] = [
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
  {
    id: "d2",
    code: "NEWYEAR25",
    description: "New Year Promotion",
    discountPercentage: 25,
    validFrom: "2025-12-25T00:00:00Z",
    validTo: "2026-01-05T23:59:59Z",
    status: "Inactive",
    createdAt: "2025-11-01T10:00:00Z",
    updatedAt: "2025-11-01T10:00:00Z",
  },
]

// Helper for pagination
function paginateDiscounts(items: Discount[], page: number, limit: number) {
  const start = (page - 1) * limit
  const paginatedItems = items.slice(start, start + limit)
  return {
    items: paginatedItems,
    total: items.length,
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get("q")
  const page = Number(searchParams.get("page")) || 1
  const limit = Number(searchParams.get("limit")) || 10

  let filtered = discounts

  if (query) {
    const lower = query.toLowerCase()
    filtered = discounts.filter(
      (d) =>
        d.code.toLowerCase().includes(lower) ||
        d.description.toLowerCase().includes(lower),
    )
  }

  return NextResponse.json(paginateDiscounts(filtered, page, limit))
}

export async function POST(request: Request) {
  const data: CreateDiscountDto = await request.json()

  const newDiscount: Discount = {
    id: `d${discounts.length + 1}`,
    ...data,
    status: data.status || "Active",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }

  discounts.push(newDiscount)
  return NextResponse.json(newDiscount, { status: 201 })
}