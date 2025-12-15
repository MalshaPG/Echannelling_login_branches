"use client"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"
import type { AuditLog } from "@/types/auditLog"

interface ViewAuditLogDetailsModalProps {
  isOpen: boolean
  onClose: () => void
  auditLog: AuditLog | null
}

export function ViewAuditLogDetailsModal({
  isOpen,
  onClose,
  auditLog,
}: ViewAuditLogDetailsModalProps) {
  if (!auditLog) return null

  const getActionBadgeVariant = (action: string) => {
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
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[95vw] sm:max-w-[700px] max-h-[90vh] overflow-y-auto p-4 sm:p-6">
        <DialogHeader>
          <DialogTitle className="text-lg sm:text-xl">Audit Log Details</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 sm:space-y-6">
          {/* Action Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm sm:text-base">Action Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <p className="text-xs sm:text-sm text-gray-500 mb-2">Action</p>
                  <Badge variant={getActionBadgeVariant(auditLog.action)} className="text-xs sm:text-sm">
                    {auditLog.action}
                  </Badge>
                </div>
                <div>
                  <p className="text-xs sm:text-sm text-gray-500 mb-2">Status</p>
                  <Badge variant={getStatusBadgeVariant(auditLog.status)} className="text-xs sm:text-sm">
                    {auditLog.status}
                  </Badge>
                </div>
              </div>
              <div>
                <p className="text-xs sm:text-sm text-gray-500 mb-2">Description</p>
                <p className="text-xs sm:text-sm font-medium break-words">{auditLog.description}</p>
              </div>
            </CardContent>
          </Card>

          {/* Entity Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm sm:text-base">Entity Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <p className="text-xs sm:text-sm text-gray-500 mb-2">Entity Type</p>
                  <p className="text-xs sm:text-sm font-medium">{auditLog.entity}</p>
                </div>
                <div>
                  <p className="text-xs sm:text-sm text-gray-500 mb-2">Entity Name</p>
                  <p className="text-xs sm:text-sm font-medium break-words">{auditLog.entityName}</p>
                </div>
              </div>
              <div>
                <p className="text-xs sm:text-sm text-gray-500 mb-2">Entity ID</p>
                <p className="text-xs sm:text-sm font-mono text-gray-600 break-words">{auditLog.entityId}</p>
              </div>
            </CardContent>
          </Card>

          {/* User Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm sm:text-base">User Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <p className="text-xs sm:text-sm text-gray-500 mb-2">User Name</p>
                  <p className="text-xs sm:text-sm font-medium break-words">{auditLog.userName}</p>
                </div>
                <div>
                  <p className="text-xs sm:text-sm text-gray-500 mb-2">User ID</p>
                  <p className="text-xs sm:text-sm font-mono text-gray-600 break-words">{auditLog.userId}</p>
                </div>
              </div>
              <div>
                <p className="text-xs sm:text-sm text-gray-500 mb-2">Email</p>
                <p className="text-xs sm:text-sm font-medium break-words">{auditLog.userEmail}</p>
              </div>
            </CardContent>
          </Card>

          {/* Timestamp Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm sm:text-base">Timestamp Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-xs sm:text-sm text-gray-500 mb-2">Action Timestamp</p>
                <p className="text-xs sm:text-sm font-medium">
                  {format(new Date(auditLog.timestamp), "MMMM d, yyyy HH:mm:ss")}
                </p>
              </div>
              {auditLog.createdAt && (
                <div>
                  <p className="text-xs sm:text-sm text-gray-500 mb-2">Log Created At</p>
                  <p className="text-xs sm:text-sm font-medium">
                    {format(new Date(auditLog.createdAt), "MMMM d, yyyy HH:mm:ss")}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Network Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm sm:text-base">Network Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-xs sm:text-sm text-gray-500 mb-2">IP Address</p>
                <p className="text-xs sm:text-sm font-mono text-gray-600 break-all">
                  {auditLog.ipAddress || "Not available"}
                </p>
              </div>
              {auditLog.userAgent && (
                <div>
                  <p className="text-xs sm:text-sm text-gray-500 mb-2">User Agent</p>
                  <p className="text-xs text-gray-600 break-words">
                    {auditLog.userAgent}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Changes/Differences */}
          {auditLog.changes && auditLog.changes.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-sm sm:text-base">Changes Made</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {auditLog.changes.map((change, index) => (
                    <div
                      key={index}
                      className="border rounded-lg p-3 bg-gray-50"
                    >
                      <p className="text-xs sm:text-sm font-medium text-gray-900 mb-2">
                        {change.field}
                      </p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                        <div>
                          <p className="text-gray-500 mb-1">Old Value</p>
                          <p className="font-mono text-gray-700 break-words">
                            {String(change.oldValue)}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-500 mb-1">New Value</p>
                          <p className="font-mono text-gray-700 break-words">
                            {String(change.newValue)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
