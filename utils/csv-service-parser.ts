import Papa from "papaparse"

export interface ServiceData {
  "Account #": string
  "Account name": string
  "Service name": string
  "Service address": string
  City: string
  ST: string
  Price: string
  Status: string
  "Container name": string
}

// Mock services data
const mockServices: ServiceData[] = [
  {
    "Account #": "ACC001",
    "Account name": "Acme Corp",
    "Service name": "Commercial Waste Collection",
    "Service address": "123 Main St",
    City: "Metro",
    ST: "CA",
    Price: "$150.00",
    Status: "Active",
    "Container name": "8YD Roll-off"
  },
  {
    "Account #": "ACC002",
    "Account name": "Smith Industries",
    "Service name": "Residential Waste Collection",
    "Service address": "456 Oak Ave",
    City: "Metro",
    ST: "CA",
    Price: "$75.00",
    Status: "Active",
    "Container name": "96 Gallon Cart"
  },
  {
    "Account #": "ACC003",
    "Account name": "Johnson LLC",
    "Service name": "Construction Debris Removal",
    "Service address": "789 Pine St",
    City: "Metro",
    ST: "CA",
    Price: "$200.00",
    Status: "Active",
    "Container name": "20YD Roll-off"
  },
  {
    "Account #": "ACC004",
    "Account name": "Green Solutions",
    "Service name": "Recycling Collection",
    "Service address": "321 Elm St",
    City: "Metro",
    ST: "CA",
    Price: "$100.00",
    Status: "Active",
    "Container name": "64 Gallon Cart"
  },
  {
    "Account #": "ACC005",
    "Account name": "Metro Apartments",
    "Service name": "Multi-Family Waste Collection",
    "Service address": "555 Park Ave",
    City: "Metro",
    ST: "CA",
    Price: "$300.00",
    Status: "Active",
    "Container name": "4YD Dumpster"
  }
]

export async function fetchServiceData(): Promise<ServiceData[]> {
  // For now, return mock data
  return mockServices
}
