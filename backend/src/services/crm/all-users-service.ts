import { parentLeadStatusModel } from '../../model/parent-lead-model.js';
import { testCodeModel } from '../../model/test-code-model.js';
import { prismaClient } from '../../prisma.js';
import { ensure } from '../../types/ensure.js';

export interface AllUsersFilters {
  q?: string;
  phoneNumber?: string;
  leadStatus?: string;
  createdAtBefore?: string;
  createdAtAfter?: string;
  page: number;
  limit: number;
  offset: number;
  orderBy: string;
  order: 'asc' | 'desc';
}

export interface AllUsersData {
  testCode: string;
  parentId: string;
  parentName: string;
  phoneNumber: string;
  details: string;
  leadStatus: string;
  lastFollowupAt: Date | null;
  studentName: string;
  createdAt: Date;
  lastAttendedAt?: Date | null;
  admin: {
    name: string;
    id: string;
  };
}

export interface AllUsersResponse {
  page: {
    total: number;
    currentPage: number;
    limit: number;
  };
  data: AllUsersData[];
}

class AllUsersService {
  async getAllUsers(filters: AllUsersFilters): Promise<AllUsersResponse> {
    try {
      const params = {
        q: filters.q ?? null,
        phoneNumber: filters.phoneNumber ?? null,
        leadStatus: filters.leadStatus ?? null,
        createdAtBefore: filters.createdAtBefore ?? null,
        createdAtAfter: filters.createdAtAfter ?? null,
        orderBy: filters.orderBy,
        order: filters.order,
        limit: filters.limit,
        offset: filters.offset,
      };
      const createDateBefore = filters.createdAtBefore
        ? new Date(filters.createdAtBefore)
        : null;
      const createDateAfter = filters.createdAtAfter
        ? new Date(filters.createdAtAfter)
        : null;

      // ---------- COUNT QUERY ----------
      const totalResult = await prismaClient.$queryRawUnsafe<
        [{ count: bigint }]
      >(
        `
      WITH latest_lead AS (
        SELECT DISTINCT ON (l."parentId")
          l."parentId",
          l."statusId",
          l."createdAt"
        FROM "Leads" l
        ORDER BY l."parentId", l."createdAt" DESC
      )
      SELECT COUNT(*)::bigint AS count
      FROM "ParentUser" p
      LEFT JOIN latest_lead ll ON ll."parentId" = p.id
      LEFT JOIN "Students" s ON s."parentId" = p.id
      WHERE
        (
          $1::text IS NULL
          OR p.name ILIKE '%' || $1 || '%'
          OR p."phoneNumber" ILIKE '%' || $1 || '%'
          OR s.name ILIKE '%' || $1 || '%'
          OR s."testCode" ILIKE '%' || $1 || '%'
        )
        AND ($2::text IS NULL OR p."phoneNumber" = $2)
        AND ($3::text IS NULL OR ll."statusId" = $3)
        AND ($4::timestamptz IS NULL OR p."createdAt" <= $4)
        AND ($5::timestamptz IS NULL OR p."createdAt" >= $5)
      `,
        params.q,
        params.phoneNumber,
        params.leadStatus,
        createDateBefore,
        createDateAfter
      );

      const total = Number(totalResult[0].count);

      // ---------- MAIN QUERY ----------
      const rows = await prismaClient.$queryRawUnsafe<any[]>(
        `
      WITH latest_lead AS (
        SELECT DISTINCT ON (l."parentId")
          l.*
        FROM "Leads" l
        ORDER BY l."parentId", l."createdAt" DESC
      ),
      latest_followup AS (
        SELECT DISTINCT ON (f."parentId")
          f.*
        FROM "Followup" f
        ORDER BY f."parentId", f."createdAt" DESC
      ),
      latest_student AS (
        SELECT DISTINCT ON (s."parentId")
          s.*
        FROM "Students" s
        ORDER BY s."parentId", s."createdAt" DESC
      ),
      latest_activity AS (
        SELECT DISTINCT ON (d."studentTestCode")
          d.*
        FROM "DailyActivity" d
        ORDER BY d."studentTestCode", d."activityDate" DESC
      )
      SELECT
        p.id AS "parentId",
        p.name AS "parentName",
        p."phoneNumber",
        p.details,
        p."createdAt",

        ll."statusId" AS "leadStatus",
        lf."createdAt" AS "lastFollowupAt",

        ls.name AS "studentName",
        ls."testCode" AS "testCode",
        la."activityDate" AS "lastAttendedAt",

        a.id AS "adminId",
        a.name AS "adminName"

      FROM "ParentUser" p
      LEFT JOIN latest_lead ll ON ll."parentId" = p.id
      LEFT JOIN latest_followup lf ON lf."parentId" = p.id
      LEFT JOIN latest_student ls ON ls."parentId" = p.id
      LEFT JOIN latest_activity la ON la."studentTestCode" = ls."testCode"
      LEFT JOIN "AdminUser" a ON a.id = p."addByAdminId"

      WHERE
        (
          $1::text IS NULL
          OR p.name ILIKE '%' || $1 || '%'
          OR p."phoneNumber" ILIKE '%' || $1 || '%'
          OR ls.name ILIKE '%' || $1 || '%'
          OR ls."testCode" ILIKE '%' || $1 || '%'
        )
        AND ($2::text IS NULL OR p."phoneNumber" = $2)
        AND ($3::text IS NULL OR ll."statusId" = $3)
        AND ($4::timestamptz IS NULL OR p."createdAt" <= $4)
        AND ($5::timestamptz IS NULL OR p."createdAt" >= $5)

      ORDER BY
        CASE WHEN $6 = 'lastFollowupAt' THEN (
          SELECT COUNT(*) FROM "Followup" f WHERE f."parentId" = p.id
        ) END DESC,
        CASE WHEN $6 = 'createdAt' AND $7 = 'asc'  THEN p."createdAt" END ASC,
        CASE WHEN $6 = 'createdAt' AND $7 = 'desc' THEN p."createdAt" END DESC

      LIMIT $8 OFFSET $9
      `,
        params.q,
        params.phoneNumber,
        params.leadStatus,
        createDateBefore,
        createDateAfter,
        params.orderBy,
        params.order,
        params.limit,
        params.offset
      );

      const defaultLeadStatus =
        await parentLeadStatusModel.getDefaultLeadStatus();

      const data: AllUsersData[] = rows.map(r => ({
        testCode: r.testCode ?? '',
        parentId: r.parentId,
        parentName: r.parentName ?? '',
        phoneNumber: r.phoneNumber,
        details: (r.details ?? []).join(', '),
        leadStatus: r.leadStatus ?? defaultLeadStatus.value,
        lastFollowupAt: r.lastFollowupAt ?? null,
        studentName: r.studentName ?? '',
        createdAt: r.createdAt,
        lastAttendedAt: r.lastAttendedAt ?? null,
        admin: {
          name: r.adminName ?? '',
          id: r.adminId,
        },
      }));

      return {
        page: {
          total,
          currentPage: filters.page,
          limit: filters.limit,
        },
        data,
      };
    } catch (err) {
      console.error(err);
      throw new Error('Failed to fetch users');
    }
  }

  async updateLeadStatus(testCode: string, leadStatus: string): Promise<void> {
    const student = await testCodeModel.getByTestCode(testCode);

    ensure(student, new Error('Test code not found'));
    ensure(student.parent, new Error('Test code not found'));

    await parentLeadStatusModel.updateLeadStatus(student.parent.id, leadStatus);
  }
}

export const allUsersService = new AllUsersService();
