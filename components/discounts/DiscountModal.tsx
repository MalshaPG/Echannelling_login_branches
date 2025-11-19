"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { useToast } from "@/hooks/use-toast"
import { discountService } from "@/lib/discountService"

interface DiscountModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

export function DiscountModal({ isOpen, onClose, onSuccess }: DiscountModalProps) {
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  
  const getDefaultDate = () => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    return today
  }
  
  const getDefaultToDate = () => {
    const date = new Date()
    date.setDate(date.getDate() + 30)
    date.setHours(0, 0, 0, 0)
    return date
  }
  
  const [formData, setFormData] = useState({
    code: "",
    description: "",
    discountPercentage: "",
    validFrom: getDefaultDate(),
    validTo: getDefaultToDate(),
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

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
      await discountService.createDiscount({
        code: formData.code,
        description: formData.description,
        discountPercentage,
        validFrom: formData.validFrom.toISOString(),
        validTo: formData.validTo.toISOString(),
        status: "Active",
      })
      toast({ title: "Success", description: "Discount created successfully" })
      onSuccess()
      onClose()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create discount",
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
          <DialogTitle>Add New Discount</DialogTitle>
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
                min={new Date().toISOString().split('T')[0]}
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
                min={formData.validFrom.toISOString().split('T')[0]}
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" className="bg-teal-600 hover:bg-teal-700" disabled={loading}>
              {loading ? "Creating..." : "Create Discount"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}