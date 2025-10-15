import type { DashboardStats, ChartDataPoint, ReconciliationData, Notification } from "@/lib/types/dashboard"

export const dashboardApi = {
  getStats: async (): Promise<DashboardStats> => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500))

    return {
      hospitals: 47,
      doctors: 382,
      transactions: 12584,
      revenue: 2400000,
      changes: {
        hospitals: 5,
        doctors: 28,
        transactions: 2340,
        revenue: 380000,
      },
    }
  },

  getChartData: async (): Promise<ChartDataPoint[]> => {
    await new Promise((resolve) => setTimeout(resolve, 500))

    return [
      { month: "Jan", web: 40000, telco: 32000, agent: 28000 },
      { month: "Feb", web: 45000, telco: 35000, agent: 31000 },
      { month: "Mar", web: 52000, telco: 38000, agent: 34000 },
      { month: "Apr", web: 48000, telco: 36000, agent: 32000 },
      { month: "May", web: 61000, telco: 42000, agent: 38000 },
      { month: "Jun", web: 55000, telco: 40000, agent: 36000 },
    ]
  },

  getReconciliationData: async (): Promise<ReconciliationData[]> => {
    await new Promise((resolve) => setTimeout(resolve, 500))

    return [
      { name: "Reconciled", value: 8540, color: "#22C55E" },
      { name: "Pending", value: 1240, color: "#F59E0B" },
      { name: "Failed", value: 340, color: "#EF4444" },
    ]
  },

  getNotifications: async (): Promise<Notification[]> => {
    await new Promise((resolve) => setTimeout(resolve, 500))

    return [
      {
        id: "1",
        type: "alert",
        title: "High Transaction Volume",
        message: "Exceeded 500 transactions in the last hour",
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
        read: false,
        icon: "AlertCircle",
      },
      {
        id: "2",
        type: "success",
        title: "Payment Reconciliation Complete",
        message: "Successfully reconciled 145 payments",
        timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
        read: true,
        icon: "CheckCircle",
      },
      {
        id: "3",
        type: "error",
        title: "Failed Transaction Alert",
        message: "12 transactions failed in the last 30 minutes",
        timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
        read: false,
        icon: "AlertTriangle",
      },
      {
        id: "4",
        type: "info",
        title: "New Doctor Registration",
        message: "Dr. Perera has been registered successfully",
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
        read: true,
        icon: "Bell",
      },
      {
        id: "5",
        type: "info",
        title: "System Maintenance Scheduled",
        message: "Scheduled maintenance on Sunday 2 AM - 4 AM",
        timestamp: new Date(Date.now() - 48 * 60 * 60 * 1000),
        read: true,
        icon: "Info",
      },
    ]
  },
}
