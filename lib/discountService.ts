import type { Discount, CreateDiscountDto, UpdateDiscountDto } from "@/types/discount"

const API_BASE_URL = "/api/discounts"

export const discountService = {
  async getAllDiscounts(page: number = 1, limit: number = 10): Promise<{ items: Discount[], total: number }> {
    const response = await fetch(`${API_BASE_URL}?page=${page}&limit=${limit}`)
    if (!response.ok) throw new Error("Failed to fetch discounts")
    return response.json()
  },

  async getDiscountById(id: string): Promise<Discount> {
    const response = await fetch(`${API_BASE_URL}/${id}`)
    if (!response.ok) throw new Error("Failed to fetch discount")
    return response.json()
  },

  async createDiscount(data: CreateDiscountDto): Promise<Discount> {
    const response = await fetch(API_BASE_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
    if (!response.ok) throw new Error("Failed to create discount")
    return response.json()
  },

  async updateDiscount(data: UpdateDiscountDto): Promise<Discount> {
    const response = await fetch(`${API_BASE_URL}/${data.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
    if (!response.ok) throw new Error("Failed to update discount")
    return response.json()
  },

  async deleteDiscount(id: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/${id}`, {
      method: "DELETE",
    })
    if (!response.ok) throw new Error("Failed to delete discount")
  },

  async searchDiscounts(query: string, page: number = 1, limit: number = 10): Promise<{ items: Discount[], total: number }> {
    const response = await fetch(`${API_BASE_URL}?q=${encodeURIComponent(query)}&page=${page}&limit=${limit}`)
    if (!response.ok) throw new Error("Failed to search discounts")
    return response.json()
  },
}