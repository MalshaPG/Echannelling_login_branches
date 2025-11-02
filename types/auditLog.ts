export interface AuditLog {
  id: string
  action: string
  user: string
  userId: string
  userRole: string
  timestamp: string
  details: string
  module: string
  ipAddress: string
  status: "Success" | "Failed"
}

export type AuditLogFilter = {
  dateFrom?: string
  dateTo?: string
  user?: string
  module?: string
  action?: string
}