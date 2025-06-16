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
  },
  {
    id: "mattress",
    name: "Mattress",
    allowPerContainer: true,
    pricing: {
      disposalTicket: {
        rate: 25.00,
        includedTonnage: 1,
        overageThreshold: 5,
        overageFee: 10.00
      },
      disposalFee: {
        rate: 25.00,
        includedTonnage: 1,
        overageThreshold: 5,
        overageFee: 10.00
      }
    }
  },
  {
    id: "mate88",
    name: "Mate88",
    allowPerContainer: true,
    pricing: {
      disposalTicket: {
        rate: 30.00,
        includedTonnage: 1,
        overageThreshold: 5,
        overageFee: 12.00
      },
      disposalFee: {
        rate: 30.00,
        includedTonnage: 1,
        overageThreshold: 5,
        overageFee: 12.00
      }
    }
  },
  {
    id: "mat34",
    name: "Mat34",
    allowPerContainer: true,
    pricing: {
      disposalTicket: {
        rate: 20.00,
        includedTonnage: 1,
        overageThreshold: 5,
        overageFee: 8.00
      },
      disposalFee: {
        rate: 20.00,
        includedTonnage: 1,
        overageThreshold: 5,
        overageFee: 8.00
      }
    }
  },
  {
    id: "no-sort-recycle",
    name: "No Sort Recycle",
    allowPerContainer: true,
    pricing: {
      disposalTicket: {
        rate: 45.00,
        includedTonnage: 1.5,
        overageThreshold: 2.5,
        overageFee: 15.00
      },
      disposalFee: {
        rate: 45.00,
        includedTonnage: 1.5,
        overageThreshold: 2.5,
        overageFee: 15.00
      }
    }
  },
  {
    id: "appliance",
    name: "Appliance",
    allowPerContainer: true,
    pricing: {
      disposalTicket: {
        rate: 35.00,
        includedTonnage: 1,
        overageThreshold: 3,
        overageFee: 15.00
      },
      disposalFee: {
        rate: 35.00,
        includedTonnage: 1,
        overageThreshold: 3,
        overageFee: 15.00
      }
    }
  },
  {
    id: "tire",
    name: "Tire",
    allowPerContainer: true,
    pricing: {
      disposalTicket: {
        rate: 5.00,
        includedTonnage: 4,
        overageThreshold: 10,
        overageFee: 2.50
      },
      disposalFee: {
        rate: 5.00,
        includedTonnage: 4,
        overageThreshold: 10,
        overageFee: 2.50
      }
    }
  },
  {
    id: "brush",
    name: "Brush",
    allowPerContainer: true,
    pricing: {
      disposalTicket: {
        rate: 85.00,
        includedTonnage: 1,
        overageThreshold: 2,
        overageFee: 30.00
      },
      disposalFee: {
        rate: 85.00,
        includedTonnage: 1,
        overageThreshold: 2,
        overageFee: 30.00
      }
    }
  },
  {
    id: "shingles",
    name: "Shingles",
    allowPerContainer: true,
    pricing: {
      disposalTicket: {
        rate: 120.00,
        includedTonnage: 1,
        overageThreshold: 1.25,
        overageFee: 55.00
      },
      disposalFee: {
        rate: 120.00,
        includedTonnage: 1,
        overageThreshold: 1.25,
        overageFee: 55.00
      }
    }
  },
  {
    id: "friable-asbestos",
    name: "Friable Asbestos",
    allowPerContainer: true,
    pricing: {
      disposalTicket: {
        rate: 250.00,
        includedTonnage: 0.5,
        overageThreshold: 1,
        overageFee: 100.00
      },
      disposalFee: {
        rate: 250.00,
        includedTonnage: 0.5,
        overageThreshold: 1,
        overageFee: 100.00
      }
    }
  },
  {
    id: "non-friable-asbestos",
    name: "Non-Friable Asbestos",
    allowPerContainer: true,
    pricing: {
      disposalTicket: {
        rate: 200.00,
        includedTonnage: 0.5,
        overageThreshold: 1,
        overageFee: 80.00
      },
      disposalFee: {
        rate: 200.00,
        includedTonnage: 0.5,
        overageThreshold: 1,
        overageFee: 80.00
      }
    }
  },
  {
    id: "fuel",
    name: "Fuel",
    allowPerContainer: true,
    pricing: {
      disposalTicket: {
        rate: 150.00,
        includedTonnage: 0.5,
        overageThreshold: 1,
        overageFee: 60.00
      },
      disposalFee: {
        rate: 150.00,
        includedTonnage: 0.5,
        overageThreshold: 1,
        overageFee: 60.00
      }
    }
  },
  {
    id: "oil-based-paint",
    name: "Oil-based Paint",
    allowPerContainer: true,
    pricing: {
      disposalTicket: {
        rate: 180.00,
        includedTonnage: 0.5,
        overageThreshold: 1,
        overageFee: 75.00
      },
      disposalFee: {
        rate: 180.00,
        includedTonnage: 0.5,
        overageThreshold: 1,
        overageFee: 75.00
      }
    }
  },
  {
    id: "household-chemicals",
    name: "Household Chemicals",
    allowPerContainer: true,
    pricing: {
      disposalTicket: {
        rate: 160.00,
        includedTonnage: 0.5,
        overageThreshold: 1,
        overageFee: 65.00
      },
      disposalFee: {
        rate: 160.00,
        includedTonnage: 0.5,
        overageThreshold: 1,
        overageFee: 65.00
      }
    }
  },
  {
    id: "general-liquid-waste",
    name: "General Liquid Waste",
    allowPerContainer: true,
    pricing: {
      disposalTicket: {
        rate: 140.00,
        includedTonnage: 0.5,
        overageThreshold: 1,
        overageFee: 55.00
      },
      disposalFee: {
        rate: 140.00,
        includedTonnage: 0.5,
        overageThreshold: 1,
        overageFee: 55.00
      }
    }
  }
];
