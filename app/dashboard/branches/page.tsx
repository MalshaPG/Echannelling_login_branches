"use client"

import { useState, useEffect } from "react"
import { ProtectedLayout } from "@/components/layout/ProtectedLayout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Search, Edit, Trash2, Eye } from "lucide-react"
import { BranchModal } from "@/components/branches/BranchModal"
import { branchService } from "@/lib/branchService"
import { useToast } from "@/hooks/use-toast"
import type { Branch } from "@/types/branch"
import Link from "next/link"

export default function BranchesPage() {
  const { toast } = useToast()
  const [branches, setBranches] = useState<Branch[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedBranch, setSelectedBranch] = useState<Branch | null>(null)

  const loadBranches = async () => {
    try {
      setLoading(true)
      const data = await branchService.getAllBranches()
      setBranches(data)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load branches",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadBranches()
  }, [])

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      loadBranches()
      return
    }

    try {
      const data = await branchService.searchBranches(searchQuery)
      setBranches(data)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to search branches",
        variant: "destructive",
      })
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this branch?")) return

    try {
      await branchService.deleteBranch(id)
      toast({ title: "Success", description: "Branch deleted successfully" })
      loadBranches()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete branch",
        variant: "destructive",
      })
    }
  }

  const handleEdit = (branch: Branch) => {
    setSelectedBranch(branch)
    setModalOpen(true)
  }

  const handleCreate = () => {
    setSelectedBranch(null)
    setModalOpen(true)
  }

  return (
    <ProtectedLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Branches Management</h1>
            <p className="text-gray-500 mt-1">Manage all branch locations and their details</p>
          </div>
          <Button onClick={handleCreate} className="bg-teal-600 hover:bg-teal-700">
            <Plus className="w-4 h-4 mr-2" />
            Add New Branch
          </Button>
        </div>

        {/* Search and Filters */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  placeholder="Search by branch name, code, or city..."
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

        {/* Branches Table */}
        <Card>
          <CardHeader>
            <CardTitle>All Branches ({branches.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8 text-gray-500">Loading branches...</div>
            ) : branches.length === 0 ? (
              <div className="text-center py-8 text-gray-500">No branches found</div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Branch Code</TableHead>
                    <TableHead>Branch Name</TableHead>
                    <TableHead>Reference Type</TableHead>
                    <TableHead>Reference Name</TableHead>
                    <TableHead>City</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {branches.map((branch) => (
                    <TableRow key={branch.id}>
                      <TableCell className="font-medium">{branch.branchCode}</TableCell>
                      <TableCell>{branch.branchName}</TableCell>
                      <TableCell>
                        <Badge variant={branch.referenceType === "Hospital" ? "default" : "secondary"}>
                          {branch.referenceType}
                        </Badge>
                      </TableCell>
                      <TableCell>{branch.referenceName}</TableCell>
                      <TableCell>{branch.city}</TableCell>
                      <TableCell className="text-sm">{branch.contactNumber}</TableCell>
                      <TableCell>
                        <Badge variant={branch.status === "Active" ? "default" : "secondary"}>{branch.status}</Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Link href={`/dashboard/branches/${branch.id}`}>
                            <Button variant="ghost" size="icon">
                              <Eye className="w-4 h-4" />
                            </Button>
                          </Link>
                          <Button variant="ghost" size="icon" onClick={() => handleEdit(branch)}>
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(branch.id)}
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
            )}
          </CardContent>
        </Card>
      </div>

      <BranchModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        branch={selectedBranch}
        onSuccess={loadBranches}
      />
    </ProtectedLayout>
  )
}
