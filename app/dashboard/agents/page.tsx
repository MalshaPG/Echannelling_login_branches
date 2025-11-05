"use client"

import { useState, useEffect } from "react"
import { ProtectedLayout } from "@/components/layout/ProtectedLayout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Search, Edit, Trash2, Eye } from "lucide-react"
import { agentService } from "@/lib/agentService"
import { useToast } from "@/hooks/use-toast"
import type { Agent } from "@/types/agent"
import Link from "next/link"

export default function AgentsPage() {
  const { toast } = useToast()
  const [agents, setAgents] = useState<Agent[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")

  const loadAgents = async () => {
    try {
      setLoading(true)
      const data = await agentService.getAllAgents()
      setAgents(data)
    } catch (error) {
      toast({ title: "Error", description: "Failed to load agents", variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadAgents()
  }, [])

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      loadAgents()
      return
    }

    try {
      const data = await agentService.searchAgents(searchQuery)
      setAgents(data)
    } catch (error) {
      toast({ title: "Error", description: "Failed to search agents", variant: "destructive" })
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this agent?")) return

    try {
      await agentService.deleteAgent(id)
      toast({ title: "Success", description: "Agent deleted successfully" })
      loadAgents()
    } catch (error) {
      toast({ title: "Error", description: "Failed to delete agent", variant: "destructive" })
    }
  }

  return (
    <ProtectedLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Cooperate Agents</h1>
            <p className="text-gray-500 mt-1">Manage agent offices and partners</p>
          </div>
          <Button className="bg-teal-600 hover:bg-teal-700">
            <Plus className="w-4 h-4 mr-2" /> Add New Agent
          </Button>
        </div>

        <Card>
          <CardContent className="pt-6">
            <div className="flex gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  placeholder="Search by agent name, code, or city..."
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
            <CardTitle>All Agents ({agents.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8 text-gray-500">Loading agents...</div>
            ) : agents.length === 0 ? (
              <div className="text-center py-8 text-gray-500">No agents found</div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Agent Code</TableHead>
                    <TableHead>Agent Name</TableHead>
                    <TableHead>Company</TableHead>
                    <TableHead>City</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {agents.map((agent) => (
                    <TableRow key={agent.id}>
                      <TableCell className="font-medium">{agent.agentCode}</TableCell>
                      <TableCell>{agent.agentName}</TableCell>
                      <TableCell>{agent.companyName || "—"}</TableCell>
                      <TableCell>{agent.city || "—"}</TableCell>
                      <TableCell className="text-sm">{agent.contactNumber || "—"}</TableCell>
                      <TableCell>
                        <Badge variant={agent.status === "Active" ? "default" : "secondary"}>{agent.status}</Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Link href={`/dashboard/agents/${agent.id}`}>
                            <Button variant="ghost" size="icon">
                              <Eye className="w-4 h-4" />
                            </Button>
                          </Link>
                          <Button variant="ghost" size="icon">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => handleDelete(agent.id)} className="text-red-600 hover:text-red-700">
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
    </ProtectedLayout>
  )
}
