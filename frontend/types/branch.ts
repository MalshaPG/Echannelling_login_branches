export type ReferenceType = "Hospital" | "Agent"
export type BranchStatus = "Active" | "Inactive"

export interface Branch {
  id: string
  branchName: string
  branchCode: string
  referenceType: ReferenceType
  referenceId: string
  referenceName: string
  address: string
  city: string
  district: string
  contactNumber: string
  email: string
  status: BranchStatus
  createdAt: string
  updatedAt: string
}

export interface CreateBranchDto {
  branchName: string
  branchCode: string
  referenceType: ReferenceType
  referenceId: string
  referenceName: string
  address: string
  city: string
  district: string
  contactNumber: string
  email: string
  status: BranchStatus
}

export interface UpdateBranchDto extends Partial<CreateBranchDto> {
  id: string
}
