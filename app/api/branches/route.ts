import { NextResponse } from "next/server"
import type { Branch, CreateBranchDto } from "@/types/branch"

// Mock data
const branches: Branch[] = [
  {
    id: "1",
    branchName: "Colombo Main Branch",
    branchCode: "CMB001",
    referenceType: "Hospital",
    referenceId: "H001",
    referenceName: "Colombo General Hospital",
    address: "Regent Street, Colombo 08",
    city: "Colombo",
    district: "Colombo",
    contactNumber: "+94112691111",
    email: "colombo@echannelling.com",
    status: "Active",
    createdAt: "2024-01-15T10:00:00Z",
    updatedAt: "2024-01-15T10:00:00Z",
  },
  {
    id: "2",
    branchName: "Kandy Branch",
    branchCode: "KDY001",
    referenceType: "Hospital",
    referenceId: "H002",
    referenceName: "Kandy Teaching Hospital",
    address: "William Gopallawa Mawatha, Kandy",
    city: "Kandy",
    district: "Kandy",
    contactNumber: "+94812234567",
    email: "kandy@echannelling.com",
    status: "Active",
    createdAt: "2024-01-20T10:00:00Z",
    updatedAt: "2024-01-20T10:00:00Z",
  },
  {
    id: "3",
    branchName: "Galle Agent Office",
    branchCode: "GAL001",
    referenceType: "Agent",
    referenceId: "A001",
    referenceName: "Southern Medical Services",
    address: "Main Street, Galle Fort",
    city: "Galle",
    district: "Galle",
    contactNumber: "+94912234567",
    email: "galle@echannelling.com",
    status: "Active",
    createdAt: "2024-02-01T10:00:00Z",
    updatedAt: "2024-02-01T10:00:00Z",
  },
]

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get("q")

  if (query) {
    const filtered = branches.filter(
      (b) =>
        b.branchName.toLowerCase().includes(query.toLowerCase()) ||
        b.branchCode.toLowerCase().includes(query.toLowerCase()) ||
        b.city.toLowerCase().includes(query.toLowerCase()),
    )
    return NextResponse.json(filtered)
  }

  return NextResponse.json(branches)
}

export async function POST(request: Request) {
  const data: CreateBranchDto = await request.json()

  const newBranch: Branch = {
    id: String(branches.length + 1),
    ...data,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }

  branches.push(newBranch)
  return NextResponse.json(newBranch, { status: 201 })
}
