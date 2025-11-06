import { prismaClient } from '../prisma.js';
import * as $Enums from '../generated/prisma/enums.js';
import { ensure } from '../types/ensure.js';
import { NotFoundError } from '../types/not-found-error.js';
import { HttpError } from '../types/http-error.js';
import { ParentUserResponse } from './parent-model.js';

export enum LeadStatus {
  LEAD,
  DICTATION_REQUESTED,
  DICTATION,
  FREE_TRIAL_REQUESTED,
  FREE_TRIAL,
  PAID_REQUESTED,
  PAID,
  NOT_INTERESTED,
}

export const leadStatusConverter = {
  fromDb: (status: $Enums.LeadStatus): LeadStatus => {
    switch (status) {
      case $Enums.LeadStatus.LEAD:
        return LeadStatus.LEAD;
      case $Enums.LeadStatus.DICTATION:
        return LeadStatus.DICTATION;
      case $Enums.LeadStatus.FREE_TRIAL:
        return LeadStatus.FREE_TRIAL;
      case $Enums.LeadStatus.PAID:
        return LeadStatus.PAID;
      case $Enums.LeadStatus.NOT_INTERESTED:
        return LeadStatus.NOT_INTERESTED;
      case $Enums.LeadStatus.DICTATION_REQUESTED:
        return LeadStatus.DICTATION_REQUESTED;
      case $Enums.LeadStatus.FREE_TRIAL_REQUESTED:
        return LeadStatus.FREE_TRIAL_REQUESTED;
      case $Enums.LeadStatus.PAID_REQUESTED:
        return LeadStatus.PAID_REQUESTED;
    }
  },
  toDb: (status: LeadStatus): $Enums.LeadStatus => {
    switch (status) {
      case LeadStatus.LEAD:
        return $Enums.LeadStatus.LEAD;
      case LeadStatus.DICTATION:
        return $Enums.LeadStatus.DICTATION;
      case LeadStatus.FREE_TRIAL:
        return $Enums.LeadStatus.FREE_TRIAL;
      case LeadStatus.PAID:
        return $Enums.LeadStatus.PAID;
      case LeadStatus.NOT_INTERESTED:
        return $Enums.LeadStatus.NOT_INTERESTED;
      case LeadStatus.DICTATION_REQUESTED:
        return $Enums.LeadStatus.DICTATION_REQUESTED;
      case LeadStatus.FREE_TRIAL_REQUESTED:
        return $Enums.LeadStatus.FREE_TRIAL_REQUESTED;
      case LeadStatus.PAID_REQUESTED:
        return $Enums.LeadStatus.PAID_REQUESTED;
    }
  },
  fromTelegram: (status: string): LeadStatus => {
    const numericStatus = parseInt(status, 10);
    if (isNaN(numericStatus)) {
      throw new HttpError(`Invalid status: ${status}`);
    }
    return LeadStatus[LeadStatus[numericStatus] as keyof typeof LeadStatus];
  },
  toString: (status: LeadStatus): string => {
    return LeadStatus[status];
  },
};

export type ParentLead = {
  phoneNumber: string;
  name?: string;
  details?: string;
  status: LeadStatus;
};

class ParentLeadStatusModel {
  public async updateLeadStatus(
    parentId: string,
    status: LeadStatus
  ): Promise<ParentUserResponse> {
    const data = await prismaClient.leads.create({
      data: {
        parentId,
        status: leadStatusConverter.toDb(status),
      },
      include: {
        parent: true,
      },
    });
    return {
      createdAt: data.parent.createdAt,
      statusCreatedAt: data.createdAt,
      id: data.parent.id,
      phoneNumber: data.parent.phoneNumber,
      name: data.parent.name || undefined,
      details: data.parent.details || [],
      status: leadStatusConverter.fromDb(data.status),
    };
  }
  public async getLeadStatus(parentId: string) {
    const data = await prismaClient.leads.findFirst({
      where: { parentId },
      orderBy: { createdAt: 'desc' },
      take: 1,
    });
    ensure(
      data,
      new NotFoundError('Lead status not found for the given parent ID')
    );
    return {
      ...data,
      status: leadStatusConverter.fromDb(data.status),
    };
  }
}

export const parentLeadStatusModel = new ParentLeadStatusModel();
