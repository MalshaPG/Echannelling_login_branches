// app/dashboard/audit-logs/page.tsx
"use client"

import { useState, useEffect } from "react"
import { ProtectedLayout } from "@/components/layout/ProtectedLayout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Search, Download, FileDown, Filter, Calendar } from "lucide-react"
import { auditLogService } from "@/lib/auditLogService"
import { useToast } from "@/hooks/use-toast"
import type { AuditLog, AuditLogFilter } from "@/types/auditLog"

export default function AuditLogsPage() {
  const { toast } = useToast()
  const [logs, setLogs] = useState<AuditLog[]>([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState<AuditLogFilter>({})
  const [searchQuery, setSearchQuery] = useState("")

  const loadLogs = async () => {
    try {
      setLoading(true)
      const data = await auditLogService.getAllLogs(filters)
      setLogs(data)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load audit logs",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadLogs()
  }, [filters])

  const handleSearch = () => {
    setFilters({ ...filters, action: searchQuery })
  }

  const handleExportCSV = async () => {
    try {
      const csv = await auditLogService.exportToCSV(logs)
      const blob = new Blob([csv], { type: "text/csv" })
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `audit-logs-${new Date().toISOString().split("T")[0]}.csv`
      a.click()
      window.URL.revokeObjectURL(url)
      
      toast({
        title: "Success",
        description: "Audit logs exported successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to export logs",
        variant: "destructive",
      })
    }
  }

  const handleExportPDF = () => {
    toast({
      title: "Info",
      description: "PDF export functionality will be implemented",
    })
  }

  const clearFilters = () => {
    setFilters({})
    setSearchQuery("")
  }

  const modules = ["All", "Authentication", "Hospitals", "Doctors", "Payments", "Discounts", "Branches", "Users", "Fees", "Invoices"]

  return (
    <ProtectedLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Audit Logs</h1>
            <p className="text-gray-500 mt-1">Track all system activities and user actions</p>
          </div>
          <div className="flex gap-3">
            <Button onClick={handleExportPDF} variant="outline">
              <FileDown className="w-4 h-4 mr-2" />
              Export PDF
            </Button>
            <Button onClick={handleExportCSV} className="bg-teal-600 hover:bg-teal-700">
              <Download className="w-4 h-4 mr-2" />
              Export CSV
            </Button>
          </div>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              {/* Search */}
              <div className="md:col-span-2 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  placeholder="Search by action or user..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                  className="pl-10"
                />
              </div>

              {/* Date From */}
              <div>
                <Input
                  type="date"
                  value={filters.dateFrom || ""}
                  onChange={(e) => setFilters({ ...filters, dateFrom: e.target.value })}
                  className="w-full"
                />
              </div>

              {/* Date To */}
              <div>
                <Input
                  type="date"
                  value={filters.dateTo || ""}
                  onChange={(e) => setFilters({ ...filters, dateTo: e.target.value })}
                  className="w-full"
                />
              </div>

              {/* Module Filter */}
              <div>
                <select
                  value={filters.module || "All"}
                  onChange={(e) =>
                    setFilters({ ...filters, module: e.target.value === "All" ? undefined : e.target.value })
                  }
                  className="w-full h-10 px-3 rounded-md border border-gray-200 bg-white text-sm"
                >
                  {modules.map((module) => (
                    <option key={module} value={module}>
                      {module}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex justify-between items-center mt-4">
              <p className="text-sm text-gray-500">
                Showing {logs.length} log{logs.length !== 1 ? "s" : ""}
              </p>
              <div className="flex gap-2">
                <Button onClick={clearFilters} variant="outline" size="sm">
                  Clear Filters
                </Button>
                <Button onClick={handleSearch} size="sm">
                  <Filter className="w-4 h-4 mr-2" />
                  Apply
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Logs Table */}
        <Card>
          <CardHeader>
            <CardTitle>Activity Log</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8 text-gray-500">Loading audit logs...</div>
            ) : logs.length === 0 ? (
              <div className="text-center py-8 text-gray-500">No audit logs found</div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Timestamp</TableHead>
                      <TableHead>Action</TableHead>
                      <TableHead>User</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Module</TableHead>
                      <TableHead>IP Address</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Details</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {logs.map((log) => (
                      <TableRow key={log.id}>
                        <TableCell className="text-sm whitespace-nowrap">
                          {new Date(log.timestamp).toLocaleString()}
                        </TableCell>
                        <TableCell className="font-medium">{log.action}</TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">{log.user}</p>
                            <p className="text-xs text-gray-500">{log.userId}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{log.userRole}</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary">{log.module}</Badge>
                        </TableCell>
                        <TableCell className="text-sm font-mono">{log.ipAddress}</TableCell>
                        <TableCell>
                          <Badge variant={log.status === "Success" ? "default" : "destructive"}>
                            {log.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="max-w-md">
                          <p className="text-sm text-gray-600 truncate" title={log.details}>
                            {log.details}
                          </p>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </ProtectedLayout>
  )
}