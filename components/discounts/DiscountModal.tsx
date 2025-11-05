"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { CalendarIcon } from "lucide-react"
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
  const [formData, setFormData] = useState({
    code: "",
    description: "",
    discountPercentage: "",
    validFrom: new Date(),
    validTo: new Date(),
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
              <Label>Valid From *</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "justify-start text-left font-normal",
                      !formData.validFrom && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.validFrom ? format(formData.validFrom, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={formData.validFrom}
                    onSelect={(date) => date && setFormData(prev => ({ ...prev, validFrom: date }))}
                    disabled={(date) => date < new Date()}
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className="grid gap-2">
              <Label>Valid To *</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "justify-start text-left font-normal",
                      !formData.validTo && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.validTo ? format(formData.validTo, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={formData.validTo}
                    onSelect={(date) => date && setFormData(prev => ({ ...prev, validTo: date }))}
                    disabled={(date) => date < formData.validFrom}
                  />
                </PopoverContent>
              </Popover>
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