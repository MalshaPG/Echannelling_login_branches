import type { Agent, CreateAgentDto, UpdateAgentDto } from "@/types/agent"

const API_BASE_URL = "/api/agents"

export const agentService = {
  async getAllAgents(): Promise<Agent[]> {
    const response = await fetch(API_BASE_URL)
    if (!response.ok) throw new Error("Failed to fetch agents")
    return response.json()
  },

  async getAgentById(id: string): Promise<Agent> {
    const response = await fetch(`${API_BASE_URL}/${id}`)
    if (!response.ok) throw new Error("Failed to fetch agent")
    return response.json()
  },

  async createAgent(data: CreateAgentDto): Promise<Agent> {
    const response = await fetch(API_BASE_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
    if (!response.ok) throw new Error("Failed to create agent")
    return response.json()
  },

  async updateAgent(data: UpdateAgentDto): Promise<Agent> {
    const response = await fetch(`${API_BASE_URL}/${data.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
    if (!response.ok) throw new Error("Failed to update agent")
    return response.json()
  },

  async deleteAgent(id: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/${id}`, {
      method: "DELETE",
    })
    if (!response.ok) throw new Error("Failed to delete agent")
  },

  async searchAgents(query: string): Promise<Agent[]> {
    const response = await fetch(`${API_BASE_URL}?q=${encodeURIComponent(query)}`)
    if (!response.ok) throw new Error("Failed to search agents")
    return response.json()
  },
}
