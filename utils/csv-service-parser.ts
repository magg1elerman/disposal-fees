import Papa from "papaparse"

export interface ServiceData {
  "Service name": string
  Price: string
  Status: string
  "Service address": string
  City: string
  ST: string
  "Account name": string
  "Account #": string
  "Tax zone": string | null
  "Container name": string
  "Service notes": string
  "Last updater": string
  "Last update": string
}

export async function fetchServiceData(): Promise<ServiceData[]> {
  try {
    const response = await fetch(
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Hero%20Dashboard_Configured%20Services_Table%20-%20first%2050-IOJmk7bzBXmCPsuGrhG6BL16w2xsGb.csv",
    )
    const csvText = await response.text()

    const result = Papa.parse<ServiceData>(csvText, {
      header: true,
      skipEmptyLines: true,
    })

    return result.data
  } catch (error) {
    console.error("Error fetching or parsing CSV data:", error)
    return []
  }
}
