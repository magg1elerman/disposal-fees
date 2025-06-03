export interface MaterialPricing {
  disposalTicket: {
    rate: number;
    includedTonnage: number;
    overageThreshold: number;
    overageFee: number;
    containerRate?: number;
  };
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
  allowPerContainer: boolean;
  pricing: MaterialPricing;
}

export const materials: Material[] = [
  {
    id: "msw",
    name: "MSW",
    allowPerContainer: true,
    pricing: {
      disposalTicket: {
        rate: 95.00,
        includedTonnage: 1,
        overageThreshold: 1.5,
        overageFee: 35.00
      },
      disposalFee: {
        rate: 95.00,
        includedTonnage: 1,
        overageThreshold: 1.5,
        overageFee: 35.00
      }
    }
  },
  {
    id: "recycling",
    name: "Recycling",
    allowPerContainer: true,
    pricing: {
      disposalTicket: {
        rate: 50.00,
        includedTonnage: 1.5,
        overageThreshold: 2,
        overageFee: 20.00
      },
      disposalFee: {
        rate: 50.00,
        includedTonnage: 1.5,
        overageThreshold: 2,
        overageFee: 20.00
      }
    }
  },
  {
    id: "cd",
    name: "C&D",
    allowPerContainer: true,
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
    }
  }
];
