import { NextResponse } from "next/server"
import type { UpdateBranchDto } from "@/types/branch"

// This would be imported from the main route in a real app
const branches = [
  {
    id: "1",
    branchName: "Colombo Main Branch",
    branchCode: "CMB001",
    referenceType: "Hospital" as const,
    referenceId: "H001",
    referenceName: "Colombo General Hospital",
    address: "Regent Street, Colombo 08",
    city: "Colombo",
    district: "Colombo",
    contactNumber: "+94112691111",
    email: "colombo@echannelling.com",
    status: "Active" as const,
    createdAt: "2024-01-15T10:00:00Z",
    updatedAt: "2024-01-15T10:00:00Z",
  },
]

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const branch = branches.find((b) => b.id === params.id)

  if (!branch) {
    return NextResponse.json({ error: "Branch not found" }, { status: 404 })
  }

  return NextResponse.json(branch)
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const data: UpdateBranchDto = await request.json()
  const index = branches.findIndex((b) => b.id === params.id)

  if (index === -1) {
    return NextResponse.json({ error: "Branch not found" }, { status: 404 })
  }

  branches[index] = {
    ...branches[index],
    ...data,
    updatedAt: new Date().toISOString(),
  }

  return NextResponse.json(branches[index])
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const index = branches.findIndex((b) => b.id === params.id)

  if (index === -1) {
    return NextResponse.json({ error: "Branch not found" }, { status: 404 })
  }

  branches.splice(index, 1)
  return NextResponse.json({ success: true })
}
