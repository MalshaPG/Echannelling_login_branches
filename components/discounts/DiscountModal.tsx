"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { X, AlertCircle } from "lucide-react"
import { discountService } from "@/lib/discountService"
import { useToast } from "@/hooks/use-toast"
import type { Discount, DiscountFormData } from "@/types/discount"

interface DiscountModalProps {
  open: boolean
  onClose: () => void
  discount?: Discount | null
  onSuccess: () => void
}

export function DiscountModal({ open, onClose, discount, onSuccess }: DiscountModalProps) {
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState<DiscountFormData>({
    code: "",
    description: "",
    percentage: 0,
    fixedAmount: 0,
    discountType: "Percentage",
    expiryDate: "",
    memberOnly: false,
    usageLimit: undefined,
    applicableFor: "All",
  })

  useEffect(() => {
    if (discount) {
      setFormData({
        code: discount.code,
        description: discount.description,
        percentage: discount.percentage,
        fixedAmount: discount.fixedAmount,
        discountType: discount.discountType,
        expiryDate: discount.expiryDate,
        memberOnly: discount.memberOnly,
        usageLimit: discount.usageLimit,
        applicableFor: discount.applicableFor,
      })
    } else {
      setFormData({
        code: "",
        description: "",
        percentage: 0,
        fixedAmount: 0,
        discountType: "Percentage",
        expiryDate: "",
        memberOnly: false,
        usageLimit: undefined,
        applicableFor: "All",
      })
    }
  }, [discount, open])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.code || !formData.description || !formData.expiryDate) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    if (formData.discountType === "Percentage" && (formData.percentage <= 0 || formData.percentage > 100)) {
      toast({
        title: "Validation Error",
        description: "Percentage must be between 1 and 100",
        variant: "destructive",
      })
      return
    }

    if (formData.discountType === "Fixed Amount" && (!formData.fixedAmount || formData.fixedAmount <= 0)) {
      toast({
        title: "Validation Error",
        description: "Fixed amount must be greater than 0",
        variant: "destructive",
      })
      return
    }

    try {
      setLoading(true)
      
      if (discount) {
        await discountService.updateDiscount(discount.id, formData)
        toast({ title: "Success", description: "Discount updated successfully" })
      } else {
        await discountService.createDiscount(formData)
        toast({ title: "Success", description: "Discount created successfully" })
      }
      
      onSuccess()
      onClose()
    } catch (error) {
      toast({
        title: "Error",
        description: discount ? "Failed to update discount" : "Failed to create discount",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const isExpiringSoon = () => {
    if (!formData.expiryDate) return false
    const daysUntilExpiry = Math.ceil(
      (new Date(formData.expiryDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
    )
    return daysUntilExpiry <= 7 && daysUntilExpiry > 0
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle>{discount ? "Edit Discount" : "Create New Discount"}</CardTitle>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Warning for expiring soon */}
            {isExpiringSoon() && (
              <div className="flex items-center gap-2 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                <AlertCircle className="w-5 h-5 text-yellow-600" />
                <p className="text-sm text-yellow-800">
                  This discount expires in less than 7 days. Consider extending the expiry date.
                </p>
              </div>
            )}

            {/* Code and Description */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Discount Code <span className="text-red-500">*</span>
                </label>
                <Input
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                  placeholder="e.g., SUMMER2025"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Expiry Date <span className="text-red-500">*</span>
                </label>
                <Input
                  type="date"
                  value={formData.expiryDate}
                  onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                  min={new Date().toISOString().split("T")[0]}
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Description <span className="text-red-500">*</span>
              </label>
              <Input
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Brief description of the discount"
                required
              />
            </div>

            {/* Discount Type */}
            <div>
              <label className="block text-sm font-medium mb-2">Discount Type</label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    value="Percentage"
                    checked={formData.discountType === "Percentage"}
                    onChange={(e) =>
                      setFormData({ ...formData, discountType: e.target.value as "Percentage" | "Fixed Amount" })
                    }
                    className="w-4 h-4"
                  />
                  <span>Percentage</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    value="Fixed Amount"
                    checked={formData.discountType === "Fixed Amount"}
                    onChange={(e) =>
                      setFormData({ ...formData, discountType: e.target.value as "Percentage" | "Fixed Amount" })
                    }
                    className="w-4 h-4"
                  />
                  <span>Fixed Amount</span>
                </label>
              </div>
            </div>

            {/* Discount Value */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {formData.discountType === "Percentage" ? (
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Percentage (%) <span className="text-red-500">*</span>
                  </label>
                  <Input
                    type="number"
                    value={formData.percentage}
                    onChange={(e) => setFormData({ ...formData, percentage: Number(e.target.value) })}
                    min="1"
                    max="100"
                    required
                  />
                </div>
              ) : (
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Fixed Amount ($) <span className="text-red-500">*</span>
                  </label>
                  <Input
                    type="number"
                    value={formData.fixedAmount || ""}
                    onChange={(e) => setFormData({ ...formData, fixedAmount: Number(e.target.value) })}
                    min="1"
                    step="0.01"
                    required
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium mb-2">Usage Limit (Optional)</label>
                <Input
                  type="number"
                  value={formData.usageLimit || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, usageLimit: e.target.value ? Number(e.target.value) : undefined })
                  }
                  min="1"
                  placeholder="Leave empty for unlimited"
                />
              </div>
            </div>

            {/* Applicable For */}
            <div>
              <label className="block text-sm font-medium mb-2">Applicable For</label>
              <select
                value={formData.applicableFor}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    applicableFor: e.target.value as "All" | "Hospitals" | "Doctors" | "Specializations",
                  })
                }
                className="w-full h-10 px-3 rounded-md border border-gray-200 bg-white text-sm"
              >
                <option value="All">All Services</option>
                <option value="Hospitals">Hospitals Only</option>
                <option value="Doctors">Doctors Only</option>
                <option value="Specializations">Specializations Only</option>
              </select>
            </div>

            {/* Member Only Toggle */}
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="memberOnly"
                checked={formData.memberOnly}
                onChange={(e) => setFormData({ ...formData, memberOnly: e.target.checked })}
                className="w-4 h-4 rounded border-gray-300"
              />
              <label htmlFor="memberOnly" className="text-sm font-medium cursor-pointer">
                Member-only discount
              </label>
              {formData.memberOnly && (
                <Badge variant="secondary" className="ml-2">
                  Members Only
                </Badge>
              )}
            </div>

            {/* Preview */}
            <div className="p-4 bg-gray-50 rounded-md border border-gray-200">
              <p className="text-sm font-medium mb-2">Preview</p>
              <div className="flex items-center gap-2">
                <Badge className="text-lg px-3 py-1">{formData.code || "CODE"}</Badge>
                <span className="text-lg font-semibold text-teal-600">
                  {formData.discountType === "Percentage"
                    ? `${formData.percentage}% OFF`
                    : `${formData.fixedAmount || 0} OFF`}
                </span>
              </div>
              <p className="text-sm text-gray-600 mt-2">{formData.description || "Description will appear here"}</p>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-3 pt-4">
              <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
                Cancel
              </Button>
              <Button type="submit" disabled={loading} className="bg-teal-600 hover:bg-teal-700">
                {loading ? "Saving..." : discount ? "Update Discount" : "Create Discount"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}