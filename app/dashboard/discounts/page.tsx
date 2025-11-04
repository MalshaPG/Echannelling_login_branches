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
import { Plus, Search, Edit, Trash2 } from "lucide-react"
import { discountService } from "@/lib/discountService"
import { useToast } from "@/hooks/use-toast"
import type { Discount } from "@/types/discount"
import { format } from "date-fns"
import { DiscountsTableSkeleton } from "@/components/discounts/DiscountsTableSkeleton"
import { DiscountModal } from "@/components/discounts/DiscountModal"

export default function DiscountsPage() {
  const { toast } = useToast()
  const [discounts, setDiscounts] = useState<Discount[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [totalItems, setTotalItems] = useState(0)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const itemsPerPage = 10

  const loadDiscounts = async (page: number = 1, search?: string) => {
    try {
      setLoading(true)
      const data = search
        ? await discountService.searchDiscounts(search, page, itemsPerPage)
        : await discountService.getAllDiscounts(page, itemsPerPage)
      setDiscounts(data.items)
      setTotalItems(data.total)
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
    loadDiscounts(currentPage)
  }, [currentPage])

  const handleSearch = () => {
    setCurrentPage(1)
    loadDiscounts(1, searchQuery)
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this discount?")) return

    try {
      await discountService.deleteDiscount(id)
      toast({ title: "Success", description: "Discount deleted successfully" })
      loadDiscounts(currentPage)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete discount",
        variant: "destructive",
      })
    }
  }

  const totalPages = Math.ceil(totalItems / itemsPerPage)

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "Active":
        return "default"
      case "Inactive":
        return "secondary"
      case "Expired":
        return "destructive"
      default:
        return "secondary"
    }
  }

  return (
    <ProtectedLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Discounts & Offers</h1>
            <p className="text-gray-500 mt-1">Manage special discounts and promotional offers</p>
          </div>
          <Button className="bg-teal-600 hover:bg-teal-700" onClick={() => setIsModalOpen(true)}>
            <Plus className="w-4 h-4 mr-2" /> Add New Discount
          </Button>
          <DiscountModal 
            isOpen={isModalOpen} 
            onClose={() => setIsModalOpen(false)} 
            onSuccess={() => loadDiscounts(currentPage)} 
          />
        </div>

        <Card>
          <CardContent className="pt-6">
            <div className="flex gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  placeholder="Search by discount code or description..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                  className="pl-10"
                />
              </div>
              <Button onClick={handleSearch} variant="outline">
                Search
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>All Discounts ({totalItems})</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <DiscountsTableSkeleton />
            ) : discounts.length === 0 ? (
              <div className="text-center py-8 text-gray-500">No discounts found</div>
            ) : (
              <>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Code</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Discount</TableHead>
                      <TableHead>Valid From</TableHead>
                      <TableHead>Valid To</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {discounts.map((discount) => (
                      <TableRow key={discount.id}>
                        <TableCell className="font-medium">{discount.code}</TableCell>
                        <TableCell>{discount.description}</TableCell>
                        <TableCell>{discount.discountPercentage}%</TableCell>
                        <TableCell>
                          {format(new Date(discount.validFrom), "MMM d, yyyy")}
                        </TableCell>
                        <TableCell>
                          {format(new Date(discount.validTo), "MMM d, yyyy")}
                        </TableCell>
                        <TableCell>
                          <Badge variant={getStatusBadgeVariant(discount.status)}>
                            {discount.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="ghost" size="icon">
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
                    ))}
                  </TableBody>
                </Table>

                <div className="mt-4">
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious
                          href="#"
                          onClick={() => currentPage > 1 && setCurrentPage(currentPage - 1)}
                        />
                      </PaginationItem>
                      {[...Array(totalPages)].map((_, i) => (
                        <PaginationItem key={i + 1}>
                          <PaginationLink
                            href="#"
                            isActive={currentPage === i + 1}
                            onClick={() => setCurrentPage(i + 1)}
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
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </ProtectedLayout>
  )
}