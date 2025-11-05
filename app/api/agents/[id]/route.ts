import { NextResponse } from "next/server"
import type { UpdateAgentDto } from "@/types/agent"

// Shared mock collection (in a real app this would be a DB)
const agents = [
  {
    id: "a1",
    agentName: "Southern Medical Services",
    agentCode: "AGT-SOUTH-001",
    companyName: "Southern Medical Services",
    address: "Galle Fort, Main St",
    city: "Galle",
    district: "Galle",
    contactNumber: "+94912234567",
    email: "contact@southern-med.lk",
    status: "Active",
    createdAt: "2024-02-01T10:00:00Z",
    updatedAt: "2024-02-01T10:00:00Z",
  },
]

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const agent = agents.find((a) => a.id === params.id)
  if (!agent) return NextResponse.json({ error: "Agent not found" }, { status: 404 })
  return NextResponse.json(agent)
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const data: UpdateAgentDto = await request.json()
  const idx = agents.findIndex((a) => a.id === params.id)
  if (idx === -1) return NextResponse.json({ error: "Agent not found" }, { status: 404 })

  agents[idx] = {
    ...agents[idx],
    ...data,
    updatedAt: new Date().toISOString(),
  }

  return NextResponse.json(agents[idx])
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const idx = agents.findIndex((a) => a.id === params.id)
  if (idx === -1) return NextResponse.json({ error: "Agent not found" }, { status: 404 })
  agents.splice(idx, 1)
  return NextResponse.json({ success: true })
}
