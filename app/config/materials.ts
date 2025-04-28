export interface MaterialPricing {
  // What we're charged by the disposal facility
  disposalTicket: {
    rate: number;
    includedTonnage: number;
    overageThreshold: number;
    overageFee: number;
    containerRate?: number;
  };
  // What we charge the customer
  disposalFee: {
    rate: number;
    includedTonnage: number;
    overageThreshold: number;
    overageFee: number;
    containerRate?: number;
  };
}

export interface Material {
  id: string;
  name: string;
  pricing: MaterialPricing;
  allowPerContainer: boolean;
  description?: string;
}

export const materials: Material[] = [
  {
    id: 'msw',
    name: 'Municipal Solid Waste',
    description: 'Standard household and commercial waste',
    pricing: {
      disposalTicket: {
        rate: 75.00,
        includedTonnage: 1,
        overageThreshold: 1.5,
        overageFee: 25.00,
        containerRate: 150.00
      },
      disposalFee: {
        rate: 95.00,
        includedTonnage: 1,
        overageThreshold: 1.5,
        overageFee: 35.00,
        containerRate: 185.00
      }
    },
    allowPerContainer: true
  },
  {
    id: 'green-waste',
    name: 'Green Waste',
    description: 'Yard trimmings, branches, and organic material',
    pricing: {
      disposalTicket: {
        rate: 45.00,
        includedTonnage: 2,
        overageThreshold: 2.5,
        overageFee: 15.00,
        containerRate: 95.00
      },
      disposalFee: {
        rate: 65.00,
        includedTonnage: 2,
        overageThreshold: 2.5,
        overageFee: 25.00,
        containerRate: 125.00
      }
    },
    allowPerContainer: true
  },
  {
    id: 'construction',
    name: 'Construction & Demolition',
    description: 'Building materials and debris',
    pricing: {
      disposalTicket: {
        rate: 85.00,
        includedTonnage: 1,
        overageThreshold: 1.25,
        overageFee: 35.00
      },
      disposalFee: {
        rate: 110.00,
        includedTonnage: 1,
        overageThreshold: 1.25,
        overageFee: 50.00
      }
    },
    allowPerContainer: false
  },
  {
    id: 'recyclables',
    name: 'Recyclables',
    description: 'Mixed recyclable materials',
    pricing: {
      disposalTicket: {
        rate: 35.00,
        includedTonnage: 1.5,
        overageThreshold: 2,
        overageFee: 10.00,
        containerRate: 75.00
      },
      disposalFee: {
        rate: 50.00,
        includedTonnage: 1.5,
        overageThreshold: 2,
        overageFee: 20.00,
        containerRate: 95.00
      }
    },
    allowPerContainer: true
  },
  {
    id: 'hazardous',
    name: 'Hazardous Waste',
    description: 'Special handling required',
    pricing: {
      disposalTicket: {
        rate: 150.00,
        includedTonnage: 0.5,
        overageThreshold: 0.75,
        overageFee: 75.00
      },
      disposalFee: {
        rate: 195.00,
        includedTonnage: 0.5,
        overageThreshold: 0.75,
        overageFee: 100.00
      }
    },
    allowPerContainer: false
  }
]; 