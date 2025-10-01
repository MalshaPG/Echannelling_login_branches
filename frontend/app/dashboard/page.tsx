"use client"

import { ProtectedLayout } from "@/components/layout/ProtectedLayout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/contexts/AuthContext"
import { Activity, Users, Calendar, Building2 } from "lucide-react"

export default function DashboardPage() {
  const { user } = useAuth()

  return (
    <ProtectedLayout>
      <div className="space-y-6">
        {/* Welcome Section */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Welcome back, {user?.name}!</h1>
          <p className="text-gray-500 mt-1">Here's what's happening with your eChannelling system today.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total Appointments</CardTitle>
              <Calendar className="w-5 h-5 text-teal-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">1,234</div>
              <p className="text-xs text-green-600 mt-1">+12% from last month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Active Patients</CardTitle>
              <Users className="w-5 h-5 text-teal-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">856</div>
              <p className="text-xs text-green-600 mt-1">+8% from last month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Active Doctors</CardTitle>
              <Activity className="w-5 h-5 text-teal-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">42</div>
              <p className="text-xs text-green-600 mt-1">+2 new this month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total Branches</CardTitle>
              <Building2 className="w-5 h-5 text-teal-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">3</div>
              <p className="text-xs text-gray-500 mt-1">Across Sri Lanka</p>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { title: "New appointment scheduled", detail: "Patient ID: PT-1001 • Dr. Smith • 2 hours ago" },
                { title: "Branch registered", detail: "Galle Branch • 4 hours ago" },
                { title: "Doctor schedule updated", detail: "Dr. Fernando • 1 day ago" },
              ].map((activity, i) => (
                <div key={i} className="flex items-start gap-4 p-3 rounded-lg bg-gray-50">
                  <div className="w-2 h-2 rounded-full bg-teal-600 mt-2" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                    <p className="text-xs text-gray-500">{activity.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </ProtectedLayout>
  )
}
