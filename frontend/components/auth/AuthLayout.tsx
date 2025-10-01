"use client"

import type React from "react"

export function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-gradient-to-br from-[#003d82] via-[#0066a1] to-[#00a896]" />

      <div className="absolute top-20 right-32 w-24 h-24 rounded-full border-4 border-[#00d9b5]/40" />
      <div className="absolute top-12 right-20 w-16 h-16 rounded-full border-4 border-[#4dd4ac]/30" />
      <div className="absolute top-1/3 left-32 w-32 h-32 rounded-full border-4 border-[#00b8d4]/30" />
      <div className="absolute bottom-32 right-16 w-20 h-20 rounded-full border-4 border-[#26c6a8]/40" />
      <div className="absolute bottom-20 right-48 w-12 h-12 rounded-full border-4 border-[#4dd4ac]/50" />

      <div className="relative z-10 w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-2xl p-8">{children}</div>
      </div>
    </div>
  )
}
