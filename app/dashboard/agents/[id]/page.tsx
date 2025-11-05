import type { Metadata } from "next"
import { Suspense } from "react"
import { ProtectedLayout } from "@/components/layout/ProtectedLayout"
import { agentService } from "@/lib/agentService"
import type { Agent } from "@/types/agent"

export const metadata: Metadata = {
  title: "Agent Detail",
}

export default async function AgentDetailPage({ params }: { params: { id: string } }) {
  let agent: Agent | null = null
  try {
    agent = await agentService.getAgentById(params.id)
  } catch (e) {
    agent = null
  }

  return (
    <ProtectedLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Agent Detail</h1>
          {!agent ? (
            <p className="text-gray-500 mt-2">Agent not found</p>
          ) : (
            <div className="mt-4">
              <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <dt className="text-sm text-gray-500">Agent Name</dt>
                  <dd className="font-medium">{agent.agentName}</dd>
                </div>
                <div>
                  <dt className="text-sm text-gray-500">Agent Code</dt>
                  <dd className="font-medium">{agent.agentCode}</dd>
                </div>
                <div>
                  <dt className="text-sm text-gray-500">Company</dt>
                  <dd className="font-medium">{agent.companyName || "—"}</dd>
                </div>
                <div>
                  <dt className="text-sm text-gray-500">City</dt>
                  <dd className="font-medium">{agent.city || "—"}</dd>
                </div>
                <div>
                  <dt className="text-sm text-gray-500">Contact</dt>
                  <dd className="font-medium">{agent.contactNumber || "—"}</dd>
                </div>
                <div>
                  <dt className="text-sm text-gray-500">Email</dt>
                  <dd className="font-medium">{agent.email || "—"}</dd>
                </div>
                <div>
                  <dt className="text-sm text-gray-500">Status</dt>
                  <dd className="font-medium">{agent.status}</dd>
                </div>
                <div>
                  <dt className="text-sm text-gray-500">Created</dt>
                  <dd className="font-medium">{agent.createdAt || "—"}</dd>
                </div>
              </dl>
            </div>
          )}
        </div>
      </div>
    </ProtectedLayout>
  )
}
