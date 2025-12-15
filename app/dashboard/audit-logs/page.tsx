"use client"

import { useState, useEffect } from "react"
import { ProtectedLayout } from "@/components/layout/ProtectedLayout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Search, Filter } from "lucide-react"
import { auditLogService } from "@/lib/auditLogService"
import { useToast } from "@/hooks/use-toast"
import { ViewAuditLogDetailsModal } from "@/components/audit-logs/ViewAuditLogDetailsModal"
import type { AuditLog, AuditLogAction, AuditLogEntity } from "@/types/auditLog"
import { format } from "date-fns"

export default function AuditLogsPage() {
  const { toast } = useToast()
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [totalItems, setTotalItems] = useState(0)
  const [filterAction, setFilterAction] = useState<AuditLogAction | "">("")
  const [filterEntity, setFilterEntity] = useState<AuditLogEntity | "">("")
  const [filterStartDate, setFilterStartDate] = useState("")
  const [filterEndDate, setFilterEndDate] = useState("")
  const [selectedAuditLog, setSelectedAuditLog] = useState<AuditLog | null>(null)
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false)
  const itemsPerPage = 10

  const loadAuditLogs = async (page: number = 1, search?: string) => {
    try {
      setLoading(true)
      let data
      if (search) {
        data = await auditLogService.searchAuditLogs(search, page, itemsPerPage)
      } else if (filterAction || filterEntity || filterStartDate || filterEndDate) {
        data = await auditLogService.filterAuditLogsAdvanced(
          filterAction || undefined,
          filterEntity || undefined,
          filterStartDate || undefined,
          filterEndDate || undefined,
          page,
          itemsPerPage
        )
      } else {
        data = await auditLogService.getAllAuditLogs(page, itemsPerPage)
      }
      setAuditLogs(data.items)
      setTotalItems(data.total)
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
    loadAuditLogs(currentPage)
  }, [currentPage])

  const handleSearch = () => {
    setCurrentPage(1)
    loadAuditLogs(1, searchQuery)
  }

  const handleFilterChange = () => {
    setCurrentPage(1)
    loadAuditLogs(1)
  }

  const totalPages = Math.ceil(totalItems / itemsPerPage)

  const getActionBadgeVariant = (action: AuditLogAction) => {
    switch (action) {
      case "CREATE":
        return "default"
      case "UPDATE":
        return "secondary"
      case "DELETE":
        return "destructive"
      case "VIEW":
        return "outline"
      case "LOGIN":
      case "LOGOUT":
        return "secondary"
      case "EXPORT":
      case "IMPORT":
        return "outline"
      default:
        return "secondary"
    }
  }

  const getStatusBadgeVariant = (status: string) => {
    return status === "Success" ? "default" : "destructive"
  }

  return (
    <ProtectedLayout>
      <div className="space-y-4 md:space-y-6 px-4 sm:px-0">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Audit Logs</h1>
          <p className="text-sm sm:text-base text-gray-500 mt-1">Track all system activities and user actions</p>
        </div>

        <Card>
          <CardContent className="pt-4 sm:pt-6">
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
                  <Input
                    placeholder="Search..."
                    className="pl-10 text-sm sm:text-base"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                  />
                </div>
                <Button onClick={handleSearch} variant="outline" className="sm:w-auto">
                  <Search className="w-4 h-4 mr-1 sm:mr-2" /> 
                  <span className="hidden sm:inline">Search</span>
                </Button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                <div>
                  <Select value={filterAction || "all"} onValueChange={(value) => {
                    setFilterAction(value === "all" ? "" : (value as AuditLogAction))
                    setCurrentPage(1)
                  }}>
                    <SelectTrigger className="text-sm">
                      <SelectValue placeholder="Filter by Action" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Actions</SelectItem>
                      <SelectItem value="CREATE">Create</SelectItem>
                      <SelectItem value="UPDATE">Update</SelectItem>
                      <SelectItem value="DELETE">Delete</SelectItem>
                      <SelectItem value="VIEW">View</SelectItem>
                      <SelectItem value="LOGIN">Login</SelectItem>
                      <SelectItem value="LOGOUT">Logout</SelectItem>
                      <SelectItem value="EXPORT">Export</SelectItem>
                      <SelectItem value="IMPORT">Import</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Select value={filterEntity || "all"} onValueChange={(value) => {
                    setFilterEntity(value === "all" ? "" : (value as AuditLogEntity))
                    setCurrentPage(1)
                  }}>
                    <SelectTrigger className="text-sm">
                      <SelectValue placeholder="Filter by Entity" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Entities</SelectItem>
                      <SelectItem value="Agent">Agent</SelectItem>
                      <SelectItem value="Branch">Branch</SelectItem>
                      <SelectItem value="Discount">Discount</SelectItem>
                      <SelectItem value="User">User</SelectItem>
                      <SelectItem value="Transaction">Transaction</SelectItem>
                      <SelectItem value="Invoice">Invoice</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Input
                    type="date"
                    value={filterStartDate}
                    onChange={(e) => {
                      setFilterStartDate(e.target.value)
                      setCurrentPage(1)
                    }}
                    className="text-sm"
                  />
                </div>
                <div>
                  <Input
                    type="date"
                    value={filterEndDate}
                    onChange={(e) => {
                      setFilterEndDate(e.target.value)
                      setCurrentPage(1)
                    }}
                    className="text-sm"
                    min={filterStartDate}
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg sm:text-xl">Activity Logs ({totalItems})</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8 text-gray-500 text-sm sm:text-base">Loading audit logs...</div>
            ) : auditLogs.length === 0 ? (
              <div className="text-center py-8 text-gray-500 text-sm sm:text-base">No audit logs found</div>
            ) : (
              <>
                {/* Desktop View */}
                <div className="hidden sm:block overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="hover:bg-transparent">
                        <TableHead className="text-xs sm:text-sm">Timestamp</TableHead>
                        <TableHead className="text-xs sm:text-sm hidden md:table-cell">User</TableHead>
                        <TableHead className="text-xs sm:text-sm">Action</TableHead>
                        <TableHead className="text-xs sm:text-sm hidden lg:table-cell">IP Address</TableHead>
                        <TableHead className="text-xs sm:text-sm">Status</TableHead>
                        <TableHead className="text-right text-xs sm:text-sm">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {auditLogs.map((log) => (
                        <TableRow key={log.id}>
                          <TableCell className="text-xs sm:text-sm font-medium whitespace-nowrap">
                            {format(new Date(log.timestamp), "MMM d HH:mm")}
                          </TableCell>
                          <TableCell className="text-xs sm:text-sm hidden md:table-cell">
                            <div>
                              <p className="font-medium truncate">{log.userName}</p>
                              <p className="text-gray-500 text-xs truncate">{log.userEmail}</p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1 sm:gap-2">
                              <Badge variant={getActionBadgeVariant(log.action)} className="text-xs">
                                {log.action}
                              </Badge>
                              <span className="text-xs text-gray-500 hidden sm:inline">{log.entity}</span>
                            </div>
                          </TableCell>
                          <TableCell className="text-xs sm:text-sm text-gray-600 font-mono hidden lg:table-cell truncate">
                            {log.ipAddress || "—"}
                          </TableCell>
                          <TableCell>
                            <Badge variant={getStatusBadgeVariant(log.status)} className="text-xs">
                              {log.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="text-blue-600 hover:text-blue-700 text-xs sm:text-sm h-8 px-2 sm:px-3"
                              onClick={() => {
                                setSelectedAuditLog(log)
                                setIsDetailsModalOpen(true)
                              }}
                            >
                              Details
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                {/* Mobile View - Card Style */}
                <div className="sm:hidden space-y-3">
                  {auditLogs.map((log) => (
                    <div key={log.id} className="border rounded-lg p-3 bg-gray-50 space-y-2">
                      <div className="flex justify-between items-start gap-2">
                        <div className="flex-1">
                          <p className="text-xs text-gray-500 mb-1">Timestamp</p>
                          <p className="text-sm font-medium">{format(new Date(log.timestamp), "MMM d, HH:mm")}</p>
                        </div>
                        <Badge variant={getStatusBadgeVariant(log.status)} className="text-xs">
                          {log.status}
                        </Badge>
                      </div>
                      
                      <div>
                        <p className="text-xs text-gray-500 mb-1">User</p>
                        <p className="text-sm font-medium">{log.userName}</p>
                        <p className="text-xs text-gray-500">{log.userEmail}</p>
                      </div>
                      
                      <div className="flex gap-2">
                        <div className="flex-1">
                          <p className="text-xs text-gray-500 mb-1">Action</p>
                          <Badge variant={getActionBadgeVariant(log.action)} className="text-xs">
                            {log.action}
                          </Badge>
                        </div>
                        <div className="flex-1">
                          <p className="text-xs text-gray-500 mb-1">Entity</p>
                          <p className="text-sm font-medium">{log.entity}</p>
                        </div>
                      </div>

                      <div>
                        <p className="text-xs text-gray-500 mb-1">IP Address</p>
                        <p className="text-xs font-mono text-gray-600">{log.ipAddress || "—"}</p>
                      </div>

                      <Button
                        variant="ghost"
                        size="sm"
                        className="w-full text-blue-600 hover:text-blue-700 text-sm h-8"
                        onClick={() => {
                          setSelectedAuditLog(log)
                          setIsDetailsModalOpen(true)
                        }}
                      >
                        View Details
                      </Button>
                    </div>
                  ))}
                </div>

                {totalPages > 1 && (
                  <div className="mt-4 overflow-x-auto">
                    <Pagination>
                      <PaginationContent className="text-xs sm:text-sm">
                        <PaginationItem>
                          <PaginationPrevious
                            href="#"
                            onClick={() => currentPage > 1 && setCurrentPage(currentPage - 1)}
                            className="text-xs sm:text-sm h-8 sm:h-10"
                          />
                        </PaginationItem>
                        {[...Array(totalPages)].map((_, i) => (
                          <PaginationItem key={i + 1}>
                            <PaginationLink
                              href="#"
                              isActive={currentPage === i + 1}
                              onClick={() => setCurrentPage(i + 1)}
                              className="text-xs sm:text-sm h-8 sm:h-10 w-8 sm:w-10"
                            >
                              {i + 1}
                            </PaginationLink>
                          </PaginationItem>
                        ))}
                        <PaginationItem>
                          <PaginationNext
                            href="#"
                            onClick={() =>
                              currentPage < totalPages && setCurrentPage(currentPage + 1)
                            }
                            className="text-xs sm:text-sm h-8 sm:h-10"
                          />
                        </PaginationItem>
                      </PaginationContent>
                    </Pagination>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>
      </div>

      <ViewAuditLogDetailsModal
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
        auditLog={selectedAuditLog}
      />
    </ProtectedLayout>
  )
}
