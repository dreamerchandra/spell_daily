import { prismaClient } from '../prisma.js';
import { ensure } from '../types/ensure.js';
import { ParentUserResponse } from './parent-model.js';

export type ParentLead = {
  phoneNumber: string;
  name?: string;
  details?: string;
  statusId: string;
  status: {
    label: string;
    value: string;
    color: string;
  };
};

class ParentLeadStatusModel {
  private defaultStatus: ParentLead['status'] | null = null;
  public async updateLeadStatus(
    parentId: string,
    statusId: string
  ): Promise<ParentUserResponse> {
    const data = await prismaClient.leads.create({
      data: {
        parentId,
        statusId: statusId,
      },
      include: {
        parent: true,
        status: true,
      },
    });
    return {
      createdAt: data.parent.createdAt,
      statusCreatedAt: data.createdAt,
      id: data.parent.id,
      phoneNumber: data.parent.phoneNumber,
      name: data.parent.name,
      details: data.parent.details || [],
      status: {
        label: data.status.label,
        value: data.status.value,
        color: data.status.color,
      },
      statusId: data.statusId,
      adminId: data.parent.addByAdminId,
    };
  }
  public async getDefaultLeadStatus() {
    if (this.defaultStatus) {
      return this.defaultStatus;
    }
    const defaultStatus = await prismaClient.leadOptions.findFirst({
      where: {
        isDefault: true,
      },
    });
    ensure(defaultStatus, 'Default lead status not found');
    this.defaultStatus = {
      label: defaultStatus.label,
      value: defaultStatus.value,
      color: defaultStatus.color,
    };
    return this.defaultStatus;
  }
  public async getLeadStatus(parentId: string): Promise<{
    statusId: string;
    status: {
      label: string;
      value: string;
      color: string;
    };
    createdAt: Date;
  }> {
    const data = await prismaClient.leads.findFirst({
      where: { parentId },
      orderBy: { createdAt: 'desc' },
      take: 1,
      include: {
        status: true,
      },
    });
    if (!data) {
      const defaultStatus = await this.getDefaultLeadStatus();
      return {
        statusId: defaultStatus.value,
        status: {
          label: defaultStatus.label,
          value: defaultStatus.value,
          color: defaultStatus.color,
        },
        createdAt: new Date(),
      };
    }
    return {
      statusId: data.statusId,
      status: {
        label: data.status.label,
        value: data.status.value,
        color: data.status.color,
      },
      createdAt: data.createdAt,
    };
  }
}

export const parentLeadStatusModel = new ParentLeadStatusModel();
