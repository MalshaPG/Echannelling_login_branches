export type AgentStatus = "Active" | "Inactive"

export interface Agent {
  id: string
  agentName: string
  agentCode: string
  companyName?: string
  address?: string
  city?: string
  district?: string
  contactNumber?: string
  email?: string
  status: AgentStatus
  createdAt?: string
  updatedAt?: string
}

export interface CreateAgentDto {
  agentName: string
  agentCode: string
  companyName?: string
  address?: string
  city?: string
  district?: string
  contactNumber?: string
  email?: string
  status?: AgentStatus
}

export interface UpdateAgentDto extends CreateAgentDto {
  id: string
}
