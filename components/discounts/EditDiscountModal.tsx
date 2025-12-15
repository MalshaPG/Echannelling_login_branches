"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { discountService } from "@/lib/discountService"
import type { Discount } from "@/types/discount"

interface EditDiscountModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  discount: Discount | null
}

export function EditDiscountModal({ isOpen, onClose, onSuccess, discount }: EditDiscountModalProps) {
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)

  const [formData, setFormData] = useState<{
    code: string
    description: string
    discountPercentage: string
    validFrom: Date
    validTo: Date
    status: "Active" | "Inactive" | "Expired"
  }>({
    code: "",
    description: "",
    discountPercentage: "",
    validFrom: new Date(),
    validTo: new Date(),
    status: "Active",
  })

  useEffect(() => {
    if (discount && isOpen) {
      setFormData({
        code: discount.code || "",
        description: discount.description || "",
        discountPercentage: discount.discountPercentage.toString() || "",
        validFrom: new Date(discount.validFrom),
        validTo: new Date(discount.validTo),
        status: (discount.status as "Active" | "Inactive" | "Expired") || "Active",
      })
    }
  }, [discount, isOpen])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!discount) return

    if (!formData.code || !formData.description || !formData.discountPercentage) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    const discountPercentage = parseFloat(formData.discountPercentage)
    if (isNaN(discountPercentage) || discountPercentage <= 0 || discountPercentage > 100) {
      toast({
        title: "Error",
        description: "Discount percentage must be between 0 and 100",
        variant: "destructive",
      })
      return
    }

    if (formData.validTo < formData.validFrom) {
      toast({
        title: "Error",
        description: "Valid to date must be after valid from date",
        variant: "destructive",
      })
      return
    }

    try {
      setLoading(true)
      await discountService.updateDiscount({
        id: discount.id,
        code: formData.code,
        description: formData.description,
        discountPercentage,
        validFrom: formData.validFrom.toISOString(),
        validTo: formData.validTo.toISOString(),
        status: formData.status,
      })
      toast({ title: "Success", description: "Discount updated successfully" })
      onSuccess()
      onClose()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update discount",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit Discount</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="code">Discount Code *</Label>
              <Input
                id="code"
                name="code"
                placeholder="e.g., SUMMER2024"
                value={formData.code}
                onChange={handleChange}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="discountPercentage">Discount Percentage *</Label>
              <Input
                id="discountPercentage"
                name="discountPercentage"
                type="number"
                min="0"
                max="100"
                placeholder="e.g., 20"
                value={formData.discountPercentage}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="description">Description *</Label>
            <Input
              id="description"
              name="description"
              placeholder="Enter discount description"
              value={formData.description}
              onChange={handleChange}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="validFrom">Valid From *</Label>
              <Input
                id="validFrom"
                type="date"
                value={formData.validFrom.toISOString().split('T')[0]}
                onChange={(e) => {
                  const date = new Date(e.target.value)
                  date.setHours(0, 0, 0, 0)
                  setFormData(prev => ({ ...prev, validFrom: date }))
                }}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="validTo">Valid To *</Label>
              <Input
                id="validTo"
                type="date"
                value={formData.validTo.toISOString().split('T')[0]}
                onChange={(e) => {
                  const date = new Date(e.target.value)
                  date.setHours(0, 0, 0, 0)
                  setFormData(prev => ({ ...prev, validTo: date }))
                }}
              />
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="status">Status</Label>
            <Select value={formData.status} onValueChange={(value: string) => setFormData(prev => ({ ...prev, status: value as "Active" | "Inactive" | "Expired" }))}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Inactive">Inactive</SelectItem>
                <SelectItem value="Expired">Expired</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" className="bg-teal-600 hover:bg-teal-700" disabled={loading}>
              {loading ? "Updating..." : "Update Discount"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
