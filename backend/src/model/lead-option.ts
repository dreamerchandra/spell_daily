import { prismaClient } from '../prisma.js';

interface LeadOption {
  value: string;
  label: string;
  color: string;
  rank: number;
  isDefault: boolean;
}

class LeadOptionModel {
  getAllOptions(): Promise<LeadOption[]> {
    return prismaClient.leadOptions.findMany({
      orderBy: {
        rank: 'asc',
      },
    });
  }
}

export const leadOptionModel = new LeadOptionModel();
