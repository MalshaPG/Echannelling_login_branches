import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"
import { mockAuditLogs } from "./mock-data"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "10")
    const query = searchParams.get("q")
    const action = searchParams.get("action")
    const entity = searchParams.get("entity")
    const startDate = searchParams.get("startDate")
    const endDate = searchParams.get("endDate")

    let filtered = [...mockAuditLogs]

    // Filter by search query
    if (query) {
      const q = query.toLowerCase()
      filtered = filtered.filter(
        (log) =>
          log.userName.toLowerCase().includes(q) ||
          log.userEmail.toLowerCase().includes(q) ||
          log.description.toLowerCase().includes(q) ||
          log.entityName.toLowerCase().includes(q)
      )
    }

    // Filter by action
    if (action) {
      filtered = filtered.filter((log) => log.action === action)
    }

    // Filter by entity
    if (entity) {
      filtered = filtered.filter((log) => log.entity === entity)
    }

    // Filter by date range
    if (startDate || endDate) {
      filtered = filtered.filter((log) => {
        const logDate = new Date(log.timestamp)
        if (startDate) {
          const start = new Date(startDate)
          start.setHours(0, 0, 0, 0)
          if (logDate < start) return false
        }
        if (endDate) {
          const end = new Date(endDate)
          end.setHours(23, 59, 59, 999)
          if (logDate > end) return false
        }
        return true
      })
    }

    // Sort by timestamp descending
    filtered.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())

    // Paginate
    const start = (page - 1) * limit
    const end = start + limit
    const items = filtered.slice(start, end)
    const total = filtered.length

    return NextResponse.json({ items, total })
  } catch (error) {
    console.error("Error in audit logs API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const newLog = {
      id: `${Date.now()}`,
      ...body,
      timestamp: new Date().toISOString(),
    }
    mockAuditLogs.push(newLog)
    return NextResponse.json(newLog, { status: 201 })
  } catch (error) {
    console.error("Error creating audit log:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
