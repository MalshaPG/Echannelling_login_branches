import { NextResponse } from "next/server"
import type { Agent, CreateAgentDto } from "@/types/agent"

// Mock data for agents
const agents: Agent[] = [
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
  {
    id: "a2",
    agentName: "Northern Health Partners",
    agentCode: "AGT-NORTH-001",
    companyName: "Northern Health Partners",
    city: "Jaffna",
    contactNumber: "+94124567890",
    email: "info@northernhealth.lk",
    status: "Inactive",
    createdAt: "2024-03-10T10:00:00Z",
    updatedAt: "2024-03-10T10:00:00Z",
  },
]

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get("q")

  if (query) {
    const lower = query.toLowerCase()
    const filtered = agents.filter(
      (a) =>
        a.agentName.toLowerCase().includes(lower) ||
        a.agentCode.toLowerCase().includes(lower) ||
        (a.companyName || "").toLowerCase().includes(lower) ||
        (a.city || "").toLowerCase().includes(lower) ||
        (a.email || "").toLowerCase().includes(lower) ||
        (a.contactNumber || "").includes(query),
    )
    return NextResponse.json(filtered)
  }

  return NextResponse.json(agents)
}

export async function POST(request: Request) {
  const data: CreateAgentDto = await request.json()

  const newAgent: Agent = {
    id: `a${agents.length + 1}`,
    ...data,
    status: data.status || "Active",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }

  agents.push(newAgent)
  return NextResponse.json(newAgent, { status: 201 })
}
