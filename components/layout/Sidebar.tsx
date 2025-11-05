"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  Building2,
  Users,
  Stethoscope,
  CreditCard,
  Wallet,
  FileText,
  Settings,
  Percent,
  ChevronDown,
  ChevronRight,
} from "lucide-react"

interface MenuItem {
  title: string
  icon: React.ReactNode
  href?: string
  children?: { title: string; href: string }[]
}

const menuItems: MenuItem[] = [
  {
    title: "Dashboard",
    icon: <LayoutDashboard className="w-5 h-5" />,
    href: "/dashboard",
  },
  {
    title: "Corporate",
    icon: <Building2 className="w-5 h-5" />,
    children: [
      { title: "Branches", href: "/dashboard/branches" },
      { title: "Hospitals", href: "/dashboard/hospitals" },
      { title: "Agents", href: "/dashboard/agents" },
    ],
  },
  {
    title: "Doctors",
    icon: <Stethoscope className="w-5 h-5" />,
    children: [
      { title: "All Doctors", href: "/dashboard/doctors" },
      { title: "Specializations", href: "/dashboard/specializations" },
      { title: "Schedules", href: "/dashboard/schedules" },
    ],
  },
  {
    title: "Patients",
    icon: <Users className="w-5 h-5" />,
    href: "/dashboard/patients",
  },
  {
    title: "Transactions",
    icon: <CreditCard className="w-5 h-5" />,
    children: [
      { title: "All Transactions", href: "/dashboard/transactions" },
      { title: "Refunds", href: "/dashboard/refunds" },
    ],
  },
  {
    title: "Invoices",
    icon: <FileText className="w-5 h-5" />,
    href: "/dashboard/invoices",
  },
  {
    title: "Discounts and offers",
    icon: <Percent className="w-5 h-5" />,
    href: "/dashboard/discounts",
  },
  {
    title: "Finance",
    icon: <Wallet className="w-5 h-5" />,
    children: [
      { title: "Revenue", href: "/dashboard/revenue" },
      { title: "Payouts", href: "/dashboard/payouts" },
    ],
  },
  {
    title: "Reports",
    icon: <FileText className="w-5 h-5" />,
    href: "/dashboard/reports",
  },
  {
    title: "Settings",
    icon: <Settings className="w-5 h-5" />,
    href: "/dashboard/settings",
  },
]

export function Sidebar() {
  const pathname = usePathname()
  const [expandedItems, setExpandedItems] = useState<string[]>(["Corporate"])

  const toggleExpand = (title: string) => {
    setExpandedItems((prev) => (prev.includes(title) ? prev.filter((item) => item !== title) : [...prev, title]))
  }

  const isActive = (href: string) => {
    if (href === "/dashboard") {
      return pathname === href
    }
    return pathname.includes(href)
  }

  return (
    <aside className="w-64 bg-gradient-to-b from-teal-600 to-green-600 text-white flex flex-col h-screen fixed left-0 top-0">
      {/* Logo */}
      <div className="p-6 border-b border-white/20">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
            <span className="text-2xl font-bold text-teal-600">e</span>
          </div>
          <div>
            <h1 className="text-xl font-bold">eChannelling</h1>
            <p className="text-xs text-white/80">Admin Portal</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4">
        <ul className="space-y-1 px-3">
          {menuItems.map((item) => (
            <li key={item.title}>
              {item.children ? (
                <div>
                  <button
                    onClick={() => toggleExpand(item.title)}
                    className={cn(
                      "w-full flex items-center justify-between px-4 py-3 rounded-lg transition-colors hover:bg-white/10",
                      expandedItems.includes(item.title) && "bg-white/10",
                    )}
                  >
                    <div className="flex items-center gap-3">
                      {item.icon}
                      <span className="font-medium">{item.title}</span>
                    </div>
                    {expandedItems.includes(item.title) ? (
                      <ChevronDown className="w-4 h-4" />
                    ) : (
                      <ChevronRight className="w-4 h-4" />
                    )}
                  </button>
                  {expandedItems.includes(item.title) && (
                    <ul className="mt-1 ml-4 space-y-1">
                      {item.children.map((child) => (
                        <li key={child.href}>
                          <Link
                            href={child.href}
                            className={cn(
                              "block px-4 py-2 rounded-lg transition-colors hover:bg-white/10",
                              isActive(child.href) && "bg-green-500/30 font-medium",
                            )}
                          >
                            {child.title}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ) : (
                <Link
                  href={item.href!}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors hover:bg-white/10",
                    isActive(item.href!) && "bg-green-500/30 font-medium",
                  )}
                >
                  {item.icon}
                  <span className="font-medium">{item.title}</span>
                </Link>
              )}
            </li>
          ))}
        </ul>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-white/20">
        <p className="text-xs text-white/60 text-center">© 2025 eChannelling</p>
      </div>
    </aside>
  )
}
