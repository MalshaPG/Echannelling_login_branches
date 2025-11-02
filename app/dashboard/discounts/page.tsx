"use client"

import { useState, useEffect } from "react"
import { ProtectedLayout } from "@/components/layout/ProtectedLayout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Search, Edit, Trash2, Power, AlertTriangle, Tag } from "lucide-react"
import { DiscountModal } from "@/components/discounts/DiscountModal"
import { discountService } from "@/lib/discountService"
import { useToast } from "@/hooks/use-toast"
import type { Discount } from "@/types/discount"

export default function DiscountsPage() {
  const { toast } = useToast()
  const [discounts, setDiscounts] = useState<Discount[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedDiscount, setSelectedDiscount] = useState<Discount | null>(null)
  const [filterStatus, setFilterStatus] = useState<string>("All")

  const loadDiscounts = async () => {
    try {
      setLoading(true)
      const data = await discountService.getAllDiscounts()
      setDiscounts(data)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load discounts",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadDiscounts()
  }, [])

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      loadDiscounts()
      return
    }

    try {
      const data = await discountService.searchDiscounts(searchQuery)
      setDiscounts(data)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to search discounts",
        variant: "destructive",
      })
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this discount?")) return

    try {
      await discountService.deleteDiscount(id)
      toast({ title: "Success", description: "Discount deleted successfully" })
      loadDiscounts()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete discount",
        variant: "destructive",
      })
    }
  }

  const handleToggleStatus = async (discount: Discount) => {
    try {
      await discountService.toggleStatus(discount.id)
      toast({
        title: "Success",
        description: `Discount ${discount.status === "Active" ? "deactivated" : "activated"} successfully`,
      })
      loadDiscounts()
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update discount status",
        variant: "destructive",
      })
    }
  }

  const handleEdit = (discount: Discount) => {
    setSelectedDiscount(discount)
    setModalOpen(true)
  }

  const handleCreate = () => {
    setSelectedDiscount(null)
    setModalOpen(true)
  }

  const isExpiringSoon = (expiryDate: string) => {
    const daysUntilExpiry = Math.ceil((new Date(expiryDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
    return daysUntilExpiry <= 7 && daysUntilExpiry > 0
  }

  const filteredDiscounts = discounts.filter((discount) => {
    if (filterStatus === "All") return true
    return discount.status === filterStatus
  })

  const stats = {
    total: discounts.length,
    active: discounts.filter((d) => d.status === "Active").length,
    expired: discounts.filter((d) => d.status === "Expired").length,
    expiringSoon: discounts.filter((d) => isExpiringSoon(d.expiryDate)).length,
  }

  return (
    <ProtectedLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Discounts & Offers</h1>
            <p className="text-gray-500 mt-1">Manage promotional codes and discount offers</p>
          </div>
          <Button onClick={handleCreate} className="bg-teal-600 hover:bg-teal-700">
            <Plus className="w-4 h-4 mr-2" />
            Add New Discount
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Total Discounts</p>
                  <p className="text-2xl font-bold mt-1">{stats.total}</p>
                </div>
                <Tag className="w-8 h-8 text-gray-400" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Active</p>
                  <p className="text-2xl font-bold mt-1 text-green-600">{stats.active}</p>
                </div>
                <Power className="w-8 h-8 text-green-400" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Expiring Soon</p>
                  <p className="text-2xl font-bold mt-1 text-yellow-600">{stats.expiringSoon}</p>
                </div>
                <AlertTriangle className="w-8 h-8 text-yellow-400" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Expired</p>
                  <p className="text-2xl font-bold mt-1 text-red-600">{stats.expired}</p>
                </div>
                <AlertTriangle className="w-8 h-8 text-red-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  placeholder="Search by code or description..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                  className="pl-10"
                />
              </div>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="h-10 px-3 rounded-md border border-gray-200 bg-white text-sm"
              >
                <option value="All">All Status</option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
                <option value="Expired">Expired</option>
              </select>
              <Button onClick={handleSearch} variant="outline">
                Search
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Discounts Table */}
        <Card>
          <CardHeader>
            <CardTitle>All Discounts ({filteredDiscounts.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8 text-gray-500">Loading discounts...</div>
            ) : filteredDiscounts.length === 0 ? (
              <div className="text-center py-8 text-gray-500">No discounts found</div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Code</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Discount</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Expiry Date</TableHead>
                    <TableHead>Usage</TableHead>
                    <TableHead>Member Only</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredDiscounts.map((discount) => {
                    const expiringSoon = isExpiringSoon(discount.expiryDate)
                    const usagePercentage = discount.usageLimit
                      ? (discount.usageCount / discount.usageLimit) * 100
                      : 0

                    return (
                      <TableRow key={discount.id}>
                        <TableCell className="font-mono font-bold text-teal-600">{discount.code}</TableCell>
                        <TableCell className="max-w-xs truncate">{discount.description}</TableCell>
                        <TableCell className="font-semibold">
                          {discount.discountType === "Percentage"
                            ? `${discount.percentage}%`
                            : `$${discount.fixedAmount}`}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{discount.applicableFor}</Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <span className="text-sm">
                              {new Date(discount.expiryDate).toLocaleDateString()}
                            </span>
                            {expiringSoon && (
                              <span title="Expiring soon">
                                <AlertTriangle className="w-4 h-4 text-yellow-500" aria-label="Expiring soon"/>
                              </span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="text-sm">
                              {discount.usageCount} / {discount.usageLimit || "∞"}
                            </p>
                            {discount.usageLimit && (
                              <div className="w-20 h-2 bg-gray-200 rounded-full mt-1">
                                <div
                                  className={`h-full rounded-full ${
                                    usagePercentage >= 90 ? "bg-red-500" : "bg-teal-500"
                                  }`}
                                  style={{ width: `${Math.min(usagePercentage, 100)}%` }}
                                />
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          {discount.memberOnly ? (
                            <Badge variant="secondary">Yes</Badge>
                          ) : (
                            <span className="text-sm text-gray-500">No</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              discount.status === "Active"
                                ? "default"
                                : discount.status === "Expired"
                                ? "destructive"
                                : "secondary"
                            }
                          >
                            {discount.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleToggleStatus(discount)}
                              disabled={discount.status === "Expired"}
                              title={discount.status === "Active" ? "Deactivate" : "Activate"}
                            >
                              <Power
                                className={`w-4 h-4 ${
                                  discount.status === "Active" ? "text-green-600" : "text-gray-400"
                                }`}
                              />
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => handleEdit(discount)}>
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDelete(discount.id)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>

      <DiscountModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        discount={selectedDiscount}
        onSuccess={loadDiscounts}
      />
    </ProtectedLayout>
  )
}