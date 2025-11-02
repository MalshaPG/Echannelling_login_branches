export interface Discount {
  id: string
  code: string
  description: string
  percentage: number
  fixedAmount?: number
  discountType: "Percentage" | "Fixed Amount"
  expiryDate: string
  memberOnly: boolean
  status: "Active" | "Inactive" | "Expired"
  usageLimit?: number
  usageCount: number
  applicableFor: "All" | "Hospitals" | "Doctors" | "Specializations"
  createdAt: string
  updatedAt: string
}

export type DiscountFormData = Omit<Discount, "id" | "createdAt" | "updatedAt" | "usageCount" | "status">