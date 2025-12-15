"use client"

import { useState, useEffect } from "react"
import { ProtectedLayout } from "@/components/layout/ProtectedLayout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { agentService } from "@/lib/agentService"
import { EditAgentModal } from "@/components/agents/EditAgentModal"
import { ArrowLeft, Edit, Trash2, Mail, Phone, MapPin, Building } from "lucide-react"
import Link from "next/link"
import type { Agent } from "@/types/agent"
import { useRouter } from "next/navigation"

interface AgentDetailsPageProps {
  params: {
    id: string
  }
}

export default function AgentDetailsPage({ params }: AgentDetailsPageProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [agent, setAgent] = useState<Agent | null>(null)
  const [loading, setLoading] = useState(true)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)

  useEffect(() => {
    loadAgent()
  }, [params.id])

  const loadAgent = async () => {
    try {
      setLoading(true)
      const data = await agentService.getAgentById(params.id)
      setAgent(data)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load agent details",
        variant: "destructive",
      })
      router.push("/dashboard/agents")
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this agent?")) return

    try {
      await agentService.deleteAgent(params.id)
      toast({ title: "Success", description: "Agent deleted successfully" })
      router.push("/dashboard/agents")
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete agent",
        variant: "destructive",
      })
    }
  }

  if (loading) {
    return (
      <ProtectedLayout>
        <div className="text-center py-8 text-gray-500">Loading agent details...</div>
      </ProtectedLayout>
    )
  }

  if (!agent) {
    return (
      <ProtectedLayout>
        <div className="text-center py-8 text-gray-500">Agent not found</div>
      </ProtectedLayout>
    )
  }

  return (
    <ProtectedLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/dashboard/agents">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="w-4 h-4" />
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{agent.agentName}</h1>
              <p className="text-gray-500 mt-1">Agent Code: {agent.agentCode}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              className="bg-teal-600 hover:bg-teal-700"
              onClick={() => setIsEditModalOpen(true)}
            >
              <Edit className="w-4 h-4 mr-2" /> Edit
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
            >
              <Trash2 className="w-4 h-4 mr-2" /> Delete
            </Button>
          </div>
        </div>

        {/* Status Badge */}
        <div>
          <Badge variant={agent.status === "Active" ? "default" : "secondary"}>
            {agent.status}
          </Badge>
        </div>

        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Building className="w-5 h-5 text-gray-400" />
                  <p className="text-sm text-gray-500">Company Name</p>
                </div>
                <p className="text-lg font-semibold">{agent.companyName || "—"}</p>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <MapPin className="w-5 h-5 text-gray-400" />
                  <p className="text-sm text-gray-500">Address</p>
                </div>
                <p className="text-lg font-semibold">{agent.address || "—"}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-2">City</p>
                <p className="text-lg font-semibold">{agent.city || "—"}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-2">District</p>
                <p className="text-lg font-semibold">{agent.district || "—"}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card>
          <CardHeader>
            <CardTitle>Contact Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Phone className="w-5 h-5 text-gray-400" />
                  <p className="text-sm text-gray-500">Contact Number</p>
                </div>
                <p className="text-lg font-semibold">{agent.contactNumber || "—"}</p>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Mail className="w-5 h-5 text-gray-400" />
                  <p className="text-sm text-gray-500">Email</p>
                </div>
                <p className="text-lg font-semibold break-all">{agent.email || "—"}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Meta Information */}
        <Card>
          <CardHeader>
            <CardTitle>Meta Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <p className="text-sm text-gray-500 mb-2">Created At</p>
                <p className="text-lg font-semibold">
                  {agent.createdAt ? new Date(agent.createdAt).toLocaleDateString() : "—"}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-2">Last Updated</p>
                <p className="text-lg font-semibold">
                  {agent.updatedAt ? new Date(agent.updatedAt).toLocaleDateString() : "—"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <EditAgentModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSuccess={loadAgent}
        agent={agent}
      />
    </ProtectedLayout>
  )
}
