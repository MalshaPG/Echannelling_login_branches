import type { AuditLog, CreateAuditLogDto } from "@/types/auditLog"

const API_BASE_URL = "/api/audit-logs"

export const auditLogService = {
  async getAllAuditLogs(page: number = 1, limit: number = 10): Promise<{ items: AuditLog[], total: number }> {
    const response = await fetch(`${API_BASE_URL}?page=${page}&limit=${limit}`)
    if (!response.ok) throw new Error("Failed to fetch audit logs")
    return response.json()
  },

  async getAuditLogById(id: string): Promise<AuditLog> {
    const response = await fetch(`${API_BASE_URL}/${id}`)
    if (!response.ok) throw new Error("Failed to fetch audit log")
    return response.json()
  },

  async createAuditLog(data: CreateAuditLogDto): Promise<AuditLog> {
    const response = await fetch(API_BASE_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
    if (!response.ok) throw new Error("Failed to create audit log")
    return response.json()
  },

  async searchAuditLogs(query: string, page: number = 1, limit: number = 10): Promise<{ items: AuditLog[], total: number }> {
    const response = await fetch(`${API_BASE_URL}?q=${encodeURIComponent(query)}&page=${page}&limit=${limit}`)
    if (!response.ok) throw new Error("Failed to search audit logs")
    return response.json()
  },

  async filterAuditLogs(action?: string, entity?: string, page: number = 1, limit: number = 10): Promise<{ items: AuditLog[], total: number }> {
    const params = new URLSearchParams()
    if (action) params.append("action", action)
    if (entity) params.append("entity", entity)
    params.append("page", page.toString())
    params.append("limit", limit.toString())
    
    const response = await fetch(`${API_BASE_URL}?${params.toString()}`)
    if (!response.ok) throw new Error("Failed to filter audit logs")
    return response.json()
  },

  async filterAuditLogsByDateRange(startDate?: string, endDate?: string, page: number = 1, limit: number = 10): Promise<{ items: AuditLog[], total: number }> {
    const params = new URLSearchParams()
    if (startDate) params.append("startDate", startDate)
    if (endDate) params.append("endDate", endDate)
    params.append("page", page.toString())
    params.append("limit", limit.toString())
    
    const response = await fetch(`${API_BASE_URL}?${params.toString()}`)
    if (!response.ok) throw new Error("Failed to filter audit logs by date")
    return response.json()
  },

  async filterAuditLogsAdvanced(action?: string, entity?: string, startDate?: string, endDate?: string, page: number = 1, limit: number = 10): Promise<{ items: AuditLog[], total: number }> {
    const params = new URLSearchParams()
    if (action) params.append("action", action)
    if (entity) params.append("entity", entity)
    if (startDate) params.append("startDate", startDate)
    if (endDate) params.append("endDate", endDate)
    params.append("page", page.toString())
    params.append("limit", limit.toString())
    
    const response = await fetch(`${API_BASE_URL}?${params.toString()}`)
    if (!response.ok) throw new Error("Failed to filter audit logs")
    return response.json()
  },
}
