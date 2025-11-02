import type { Discount, DiscountFormData } from "@/types/discount"

const mockDiscounts: Discount[] = [
  {
    id: "1",
    code: "SUMMER2025",
    description: "Summer season special discount",
    percentage: 20,
    discountType: "Percentage",
    expiryDate: "2025-12-31",
    memberOnly: true,
    status: "Active",
    usageLimit: 100,
    usageCount: 45,
    applicableFor: "All",
    createdAt: "2025-10-01T10:00:00",
    updatedAt: "2025-10-20T14:30:00",
  },
  {
    id: "2",
    code: "WELCOME10",
    description: "Welcome discount for new members",
    percentage: 10,
    discountType: "Percentage",
    expiryDate: "2025-11-30",
    memberOnly: true,
    status: "Active",
    usageLimit: 500,
    usageCount: 234,
    applicableFor: "All",
    createdAt: "2025-09-15T09:00:00",
    updatedAt: "2025-10-15T11:20:00",
  },
  {
    id: "3",
    code: "HOSPITAL50",
    description: "Fixed discount for hospital consultations",
    percentage: 0,
    fixedAmount: 50,
    discountType: "Fixed Amount",
    expiryDate: "2025-11-15",
    memberOnly: false,
    status: "Active",
    usageLimit: 200,
    usageCount: 178,
    applicableFor: "Hospitals",
    createdAt: "2025-10-10T08:00:00",
    updatedAt: "2025-10-22T16:45:00",
  },
  {
    id: "4",
    code: "EXPIRED2024",
    description: "Year-end sale discount",
    percentage: 15,
    discountType: "Percentage",
    expiryDate: "2025-01-15",
    memberOnly: false,
    status: "Expired",
    usageLimit: 300,
    usageCount: 289,
    applicableFor: "All",
    createdAt: "2024-12-01T10:00:00",
    updatedAt: "2025-01-15T23:59:59",
  },
  {
    id: "5",
    code: "SPECIALIST25",
    description: "Specialist consultation discount",
    percentage: 25,
    discountType: "Percentage",
    expiryDate: "2025-12-25",
    memberOnly: true,
    status: "Active",
    usageLimit: 150,
    usageCount: 67,
    applicableFor: "Specializations",
    createdAt: "2025-10-05T12:00:00",
    updatedAt: "2025-10-18T10:15:00",
  },
  {
    id: "6",
    code: "INACTIVE50",
    description: "Temporarily disabled discount",
    percentage: 50,
    discountType: "Percentage",
    expiryDate: "2026-03-31",
    memberOnly: false,
    status: "Inactive",
    usageLimit: 100,
    usageCount: 12,
    applicableFor: "All",
    createdAt: "2025-10-20T15:00:00",
    updatedAt: "2025-10-24T09:30:00",
  },
]

export const discountService = {
  getAllDiscounts: async (): Promise<Discount[]> => {
    await new Promise((resolve) => setTimeout(resolve, 500))
    return [...mockDiscounts].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
  },

  getDiscountById: async (id: string): Promise<Discount | null> => {
    await new Promise((resolve) => setTimeout(resolve, 300))
    return mockDiscounts.find((d) => d.id === id) || null
  },

  createDiscount: async (data: DiscountFormData): Promise<Discount> => {
    await new Promise((resolve) => setTimeout(resolve, 500))
    
    const now = new Date().toISOString()
    const newDiscount: Discount = {
      ...data,
      id: `${mockDiscounts.length + 1}`,
      usageCount: 0,
      status: new Date(data.expiryDate) < new Date() ? "Expired" : "Active",
      createdAt: now,
      updatedAt: now,
    }
    
    mockDiscounts.push(newDiscount)
    return newDiscount
  },

  updateDiscount: async (id: string, data: Partial<DiscountFormData>): Promise<Discount> => {
    await new Promise((resolve) => setTimeout(resolve, 500))
    
    const index = mockDiscounts.findIndex((d) => d.id === id)
    if (index === -1) throw new Error("Discount not found")

    const updated = {
      ...mockDiscounts[index],
      ...data,
      updatedAt: new Date().toISOString(),
    }

    if (data.expiryDate) {
      updated.status = new Date(data.expiryDate) < new Date() ? "Expired" : updated.status
    }

    mockDiscounts[index] = updated
    return updated
  },

  deleteDiscount: async (id: string): Promise<void> => {
    await new Promise((resolve) => setTimeout(resolve, 300))
    const index = mockDiscounts.findIndex((d) => d.id === id)
    if (index !== -1) {
      mockDiscounts.splice(index, 1)
    }
  },

  toggleStatus: async (id: string): Promise<Discount> => {
    await new Promise((resolve) => setTimeout(resolve, 300))
    
    const index = mockDiscounts.findIndex((d) => d.id === id)
    if (index === -1) throw new Error("Discount not found")

    const discount = mockDiscounts[index]
    
    if (discount.status === "Expired") {
      throw new Error("Cannot activate expired discount")
    }

    discount.status = discount.status === "Active" ? "Inactive" : "Active"
    discount.updatedAt = new Date().toISOString()
    
    return discount
  },

  searchDiscounts: async (query: string): Promise<Discount[]> => {
    await new Promise((resolve) => setTimeout(resolve, 300))
    
    const lowerQuery = query.toLowerCase()
    return mockDiscounts.filter(
      (d) =>
        d.code.toLowerCase().includes(lowerQuery) ||
        d.description.toLowerCase().includes(lowerQuery)
    )
  },
}