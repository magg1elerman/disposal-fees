// Define the MaterialPricing type
export type MaterialPricing = {
  materialType: string
  rateStructure: string
  rate: string
  minCharge: string
  freeTonnage: number
  overageCharge: string
  overageThreshold: number
  freeTonnageUnits?: string
  defaultRate?: string
  tiers?: { id: number; from: number; to: number | null; rate: number }[]
}

// Define the DisposalFee type
export type DisposalFee = {
  id?: number
  name: string
  description: string
  rateStructure: string
  rate: string
  minCharge: string
  businessLine: string
  status?: string
  locations?: number
  material?: string
  materials?: string[]
  includedTonnage: number
  glCode: string
  linkedServices?: number
  tiers?: { id: number; from: number; to: number | null; rate: number }[]
  overageCharge: string
  overageThreshold: number
  materialPricing?: MaterialPricing[]
  containers?: string[]
  containerPricing?: ContainerPricing[]
}

// Define the ContainerPricing type
export type ContainerPricing = {
  rate: string
} 