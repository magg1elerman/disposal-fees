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
    name: 'MSW',
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
    id: 'recycling',
    name: 'Recycling',
    description: 'Mixed recyclables',
    pricing: {
      disposalTicket: {
        rate: 50.00,
        includedTonnage: 1.5,
        overageThreshold: 2,
        overageFee: 20.00,
        containerRate: 95.00
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
    id: 'cnd',
    name: 'C&D',
    description: 'Construction and demolition waste',
    pricing: {
      disposalTicket: {
        rate: 110.00,
        includedTonnage: 1,
        overageThreshold: 1.25,
        overageFee: 50.00
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
    id: 'green-waste',
    name: 'Green Waste',
    description: 'Yard waste and organic material',
    pricing: {
      disposalTicket: {
        rate: 65.00,
        includedTonnage: 2,
        overageThreshold: 2.5,
        overageFee: 25.00,
        containerRate: 125.00
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
    id: 'hazardous',
    name: 'Hazardous Waste',
    description: 'Special handling for hazardous materials',
    pricing: {
      disposalTicket: {
        rate: 195.00,
        includedTonnage: 0.5,
        overageThreshold: 0.75,
        overageFee: 100.00
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