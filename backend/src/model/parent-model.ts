import { prismaClient } from '../prisma.js';
import { ensure } from '../types/ensure.js';
import { NotFoundError } from '../types/not-found-error.js';
import { UniqueConstraintError } from '../types/unique-constrain-error.js';
import { parentLeadStatusModel } from './parent-lead-model.js';
import { LeadStatus } from './parent-lead-model.js';

export type ParentUser = {
  phoneNumber: string;
  name?: string | null;
  details?: string;
  adminId: string;
};

export interface ParentUserResponse extends Omit<ParentUser, 'details'> {
  id: string;
  createdAt: Date;
  statusCreatedAt: Date;
  status: LeadStatus;
  details: string[];
}

class ParentModel {
  public async createParent(data: ParentUser): Promise<ParentUserResponse> {
    const { phoneNumber, name, details: otherDetails } = data;
    try {
      const parent = await prismaClient.parentUser.create({
        data: {
          phoneNumber,
          name,
          details: otherDetails ? [otherDetails] : [],
          addByAdminId: data.adminId,
        },
      });
      const status = await parentLeadStatusModel.updateLeadStatus(
        parent.id,
        LeadStatus.LEAD
      );
      return {
        ...parent,
        createdAt: new Date(),
        status: status.status,
        statusCreatedAt: status.createdAt,
        adminId: data.adminId,
      };
    } catch (error) {
      if (
        error instanceof Error &&
        error.message.includes('Unique constraint failed')
      ) {
        throw new UniqueConstraintError(
          'Parent with this phone number already exists.'
        );
      }
      throw error;
    }
  }

  public async findByPhoneNumber(
    phoneNumber: string
  ): Promise<ParentUserResponse> {
    const parent = await prismaClient.parentUser.findUnique({
      where: { phoneNumber },
    });
    ensure(
      parent,
      new NotFoundError('Parent not found with the given phone number')
    );
    const status = await parentLeadStatusModel.getLeadStatus(parent.id);
    return {
      ...parent,
      details: parent.details || [],
      status: status.status,
      statusCreatedAt: status.createdAt,
      adminId: parent.addByAdminId,
    };
  }

  async getById(id: string): Promise<ParentUserResponse> {
    const parent = await prismaClient.parentUser.findUnique({
      where: { id },
    });
    ensure(parent, new NotFoundError('Parent not found with the given id'));
    const status = await parentLeadStatusModel.getLeadStatus(parent.id);
    return {
      ...parent,
      details: parent.details || [],
      status: status.status,
      statusCreatedAt: status.createdAt,
      adminId: parent.addByAdminId,
    };
  }

  async searchByName(
    name: string,
    limit: number = 10
  ): Promise<ParentUserResponse[]> {
    const parents = await prismaClient.parentUser.findMany({
      where: {
        name: {
          contains: name,
          mode: 'insensitive',
        },
      },
      take: limit,
    });

    const parentDetails = await Promise.all(
      parents.map(async parent => {
        const status = await parentLeadStatusModel.getLeadStatus(parent.id);
        return {
          ...parent,
          details: parent.details || [],
          status: status.status,
          statusCreatedAt: status.createdAt,
          adminId: parent.addByAdminId,
        };
      })
    );
    return parentDetails;
  }
}

export const parentModel = new ParentModel();
