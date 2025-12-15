export type AuditLogAction = "CREATE" | "UPDATE" | "DELETE" | "VIEW" | "LOGIN" | "LOGOUT" | "EXPORT" | "IMPORT"

export type AuditLogEntity = "Agent" | "Branch" | "Discount" | "User" | "Transaction" | "Invoice"

export interface AuditLog {
  id: string
  userId: string
  userName: string
  userEmail: string
  action: AuditLogAction
  entity: AuditLogEntity
  entityId: string
  entityName: string
  description: string
  changes?: {
    field: string
    oldValue: string | number | boolean
    newValue: string | number | boolean
  }[]
  ipAddress?: string
  userAgent?: string
  status: "Success" | "Failed"
  timestamp: string
  createdAt?: string
}

export interface CreateAuditLogDto {
  userId: string
  userName: string
  userEmail: string
  action: AuditLogAction
  entity: AuditLogEntity
  entityId: string
  entityName: string
  description: string
  changes?: {
    field: string
    oldValue: string | number | boolean
    newValue: string | number | boolean
  }[]
  ipAddress?: string
  userAgent?: string
  status: "Success" | "Failed"
}
