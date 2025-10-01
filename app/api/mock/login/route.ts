import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { username, password, twoFA } = body

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 800))

    // Mock validation logic
    if (username === "admin" && password === "admin123" && twoFA === "123456") {
      return NextResponse.json({
        token: "mock-jwt-token-" + Date.now(),
        user: {
          name: "Admin User",
          role: "superadmin",
          email: "admin@echannelling.lk",
        },
      })
    }

    // Invalid credentials
    return NextResponse.json(
      { error: "Invalid credentials. Please check your username, password, and 2FA code." },
      { status: 401 },
    )
  } catch (error) {
    return NextResponse.json({ error: "Server error. Please try again later." }, { status: 500 })
  }
}
