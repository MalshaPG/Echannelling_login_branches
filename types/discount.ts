export type DiscountStatus = "Active" | "Inactive" | "Expired"

export interface Discount {
  id: string
  code: string
  description: string
  discountPercentage: number
  validFrom: string // ISO date string
  validTo: string // ISO date string
  status: DiscountStatus
  createdAt?: string
  updatedAt?: string
}

export interface CreateDiscountDto {
  code: string
  description: string
  discountPercentage: number
  validFrom: string
  validTo: string
  status?: DiscountStatus
}

export interface UpdateDiscountDto extends CreateDiscountDto {
  id: string
}