import type { AuditLog, AuditLogFilter } from "@/types/auditLog"

const mockAuditLogs: AuditLog[] = [
  {
    id: "1",
    action: "User Login",
    user: "John Admin",
    userId: "U001",
    userRole: "Admin",
    timestamp: "2025-10-26T08:30:15",
    details: "User logged in successfully from Chrome browser",
    module: "Authentication",
    ipAddress: "192.168.1.100",
    status: "Success",
  },
  {
    id: "2",
    action: "Hospital Created",
    user: "Sarah Manager",
    userId: "U002",
    userRole: "Manager",
    timestamp: "2025-10-26T09:15:22",
    details: "Created new hospital: City General Hospital",
    module: "Hospitals",
    ipAddress: "192.168.1.105",
    status: "Success",
  },
  {
    id: "3",
    action: "Doctor Updated",
    user: "Mike Editor",
    userId: "U003",
    userRole: "Editor",
    timestamp: "2025-10-26T10:22:45",
    details: "Updated doctor profile: Dr. Smith (Specialization changed)",
    module: "Doctors",
    ipAddress: "192.168.1.110",
    status: "Success",
  },
  {
    id: "4",
    action: "Payment Refund",
    user: "John Admin",
    userId: "U001",
    userRole: "Admin",
    timestamp: "2025-10-26T11:05:33",
    details: "Refunded payment ID: PAY-12345 - Amount: $150.00",
    module: "Payments",
    ipAddress: "192.168.1.100",
    status: "Success",
  },
  {
    id: "5",
    action: "Failed Login Attempt",
    user: "Unknown",
    userId: "N/A",
    userRole: "N/A",
    timestamp: "2025-10-26T11:30:10",
    details: "Failed login attempt with username: admin123",
    module: "Authentication",
    ipAddress: "192.168.1.200",
    status: "Failed",
  },
  {
    id: "6",
    action: "Discount Created",
    user: "Sarah Manager",
    userId: "U002",
    userRole: "Manager",
    timestamp: "2025-10-26T12:00:18",
    details: "Created discount code: SUMMER2025 - 20% off",
    module: "Discounts",
    ipAddress: "192.168.1.105",
    status: "Success",
  },
  {
    id: "7",
    action: "Branch Deleted",
    user: "John Admin",
    userId: "U001",
    userRole: "Admin",
    timestamp: "2025-10-26T13:15:42",
    details: "Deleted branch: Downtown Branch (BR-005)",
    module: "Branches",
    ipAddress: "192.168.1.100",
    status: "Success",
  },
  {
    id: "8",
    action: "User Created",
    user: "John Admin",
    userId: "U001",
    userRole: "Admin",
    timestamp: "2025-10-26T14:20:55",
    details: "Created new user: Emily Viewer with Viewer role",
    module: "Users",
    ipAddress: "192.168.1.100",
    status: "Success",
  },
  {
    id: "9",
    action: "Fee Updated",
    user: "Mike Editor",
    userId: "U003",
    userRole: "Editor",
    timestamp: "2025-10-26T15:10:30",
    details: "Updated channeling fee for Telco network: $25.00 -> $30.00",
    module: "Fees",
    ipAddress: "192.168.1.110",
    status: "Success",
  },
  {
    id: "10",
    action: "Invoice Generated",
    user: "Sarah Manager",
    userId: "U002",
    userRole: "Manager",
    timestamp: "2025-10-26T16:05:12",
    details: "Generated invoice: INV-2025-1234 for transaction TXN-9876",
    module: "Invoices",
    ipAddress: "192.168.1.105",
    status: "Success",
  },
]

export const auditLogService = {
  getAllLogs: async (filters?: AuditLogFilter): Promise<AuditLog[]> => {
    await new Promise((resolve) => setTimeout(resolve, 500))
    
    let filtered = [...mockAuditLogs]

    if (filters?.dateFrom) {
      filtered = filtered.filter((log) => new Date(log.timestamp) >= new Date(filters.dateFrom!))
    }

    if (filters?.dateTo) {
      filtered = filtered.filter((log) => new Date(log.timestamp) <= new Date(filters.dateTo!))
    }

    if (filters?.user) {
      filtered = filtered.filter((log) => 
        log.user.toLowerCase().includes(filters.user!.toLowerCase())
      )
    }

    if (filters?.module) {
      filtered = filtered.filter((log) => log.module === filters.module)
    }

    if (filters?.action) {
      filtered = filtered.filter((log) => 
        log.action.toLowerCase().includes(filters.action!.toLowerCase())
      )
    }

    return filtered.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
  },

  exportToCSV: async (logs: AuditLog[]): Promise<string> => {
    const headers = ["ID", "Action", "User", "Role", "Timestamp", "Module", "IP Address", "Status", "Details"]
    const rows = logs.map((log) => [
      log.id,
      log.action,
      log.user,
      log.userRole,
      new Date(log.timestamp).toLocaleString(),
      log.module,
      log.ipAddress,
      log.status,
      log.details,
    ])

    const csv = [headers, ...rows].map((row) => row.join(",")).join("\n")
    return csv
  },
}