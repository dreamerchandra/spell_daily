import { z } from 'zod';
import { prismaClient } from '../../prisma.js';
import { ParentUser, Students } from '../../generated/prisma/client.js';

// Enums
const StudentStatusEnum = z.enum(['DICTATION', 'FREE_TRIAL', 'PAID']);

type ExistingStudent = Students & {
  parent: ParentUser | null;
};

type IncomingStudent = z.infer<typeof ParentUserSchema>['students'];

// Parent schema
export const ParentUserSchema = z.object({
  phoneNumber: z.string(),
  name: z
    .preprocess(val => (typeof val === 'string' ? val.trim() : val), z.string())
    .nullable(),
  details: z.array(z.string()),
  addByAdminId: z.string(),
  students: z.object({
    testCode: z.string(),
    name: z
      .preprocess(
        val => (typeof val === 'string' ? val.trim() : val),
        z.string()
      )
      .nullable(),
    status: StudentStatusEnum,
    details: z.object({
      grade: z.number().nullable(),
    }),
  }),
});

// Main payload schema
export const ParentPayloadSchema = z.object({
  parents: z.array(ParentUserSchema),
});

class BulkUpdateService {
  public async doDryRunUpdate(_payload: unknown) {
    const payload = ParentPayloadSchema.parse(_payload);
    const parents = payload.parents;

    const added: Record<
      string,
      {
        student: { added: string[]; updates: string[] };
      }
    > = {};

    const updates: Record<
      string,
      {
        changedKeys?: string[];
        student: { added: string[]; updates: string[] };
      }
    > = {};

    const badTestCodes: string[] = [];

    for (const parentPayload of parents) {
      const {
        phoneNumber,
        name,
        details,
        addByAdminId,
        students: studentPayload,
      } = parentPayload;

      const existingParent = await prismaClient.parentUser.findUnique({
        where: { phoneNumber },
        include: { Students: true },
      });

      // --------------------------
      // 1️⃣ Student belongs to another parent?
      // --------------------------
      const existingStudent = await prismaClient.students.findUnique({
        where: { testCode: studentPayload.testCode },
        include: { parent: true },
      });

      if (
        existingStudent &&
        existingStudent.parent?.phoneNumber !== phoneNumber
      ) {
        badTestCodes.push(studentPayload.testCode);
        continue; // continue scanning so we report ALL bad codes
      }

      // --------------------------
      // 2️⃣ Parent does NOT exist → mark as added
      // --------------------------
      if (!existingParent) {
        if (!added[phoneNumber]) {
          added[phoneNumber] = {
            student: { added: [], updates: [] },
          };
        }
        added[phoneNumber].student.added.push(studentPayload.testCode);
        continue;
      }

      // --------------------------
      // 3️⃣ Parent exists → check parent-level changes
      // --------------------------
      const changedKeys: string[] = [];
      const existingName = (existingParent.name ?? null)
        ?.replaceAll(' ', '')
        .toLocaleLowerCase();
      const incomingName = (name ?? null)
        ?.replaceAll(' ', '')
        .toLocaleLowerCase();

      if (existingName !== incomingName) {
        changedKeys.push('name');
      }

      // details is string[]
      const detailsChanged =
        JSON.stringify(existingParent.details ?? [])
          .replaceAll(' ', '')
          .toLowerCase() !==
        JSON.stringify(details ?? [])
          .replaceAll(' ', '')
          .toLowerCase();

      if (detailsChanged) {
        changedKeys.push('details');
      }

      if (existingParent.addByAdminId !== addByAdminId) {
        changedKeys.push('addByAdminId');
      }

      // --------------------------
      // 4️⃣ Student-level checks
      // --------------------------
      const parentUpdateBucket =
        updates[phoneNumber] ??
        (updates[phoneNumber] = {
          student: { added: [], updates: [] },
        });

      if (changedKeys.length > 0) {
        parentUpdateBucket.changedKeys = changedKeys;
      }

      if (!existingStudent) {
        // New test code for an existing parent
        parentUpdateBucket.student.added.push(studentPayload.testCode);
      } else {
        // existing student → check changes
        const studentChanged = this.isStudentChanged(
          existingStudent,
          studentPayload
        );

        if (studentChanged) {
          parentUpdateBucket.student.updates.push(studentPayload.testCode);
        }
      }
    }

    // --------------------------
    // 5️⃣ Return failure response if mismatched testcodes found
    // --------------------------
    if (badTestCodes.length > 0) {
      return {
        ok: false,
        testCodes: badTestCodes,
      };
    }

    // --------------------------
    // 6️⃣ Return success structure
    // --------------------------
    return {
      ok: true,
      added,
      updates: this.pushUpdateIfNotEmpty(updates),
    };
  }

  pushUpdateIfNotEmpty(
    update: Record<
      string,
      {
        changedKeys?: string[];
        student: {
          added: string[];
          updates: string[];
        };
      }
    >
  ) {
    const result: Record<
      string,
      {
        changedKeys?: string[];
        student: {
          added: string[];
          updates: string[];
        };
      }
    > = {};
    Object.entries(update).forEach(([phoneNumber, updateData]) => {
      // Only push if there are actual changes
      if (
        (updateData.changedKeys && updateData.changedKeys.length > 0) ||
        updateData.student.added.length > 0 ||
        updateData.student.updates.length > 0
      ) {
        result[phoneNumber] = updateData;
      }
    });
    return result;
  }

  private isStudentChanged(
    existing: ExistingStudent,
    incoming: IncomingStudent
  ) {
    let changed = false;
    const existingName = (existing.name ?? null)
      ?.replaceAll(' ', '')
      .toLocaleLowerCase();
    const incomingName = (incoming.name ?? null)
      ?.replaceAll(' ', '')
      .toLocaleLowerCase();

    if (existingName !== incomingName) {
      changed = true;
    }

    if (existing.status !== incoming.status) {
      changed = true;
    }

    const gradeChanged =
      ((existing.details as any)?.grade ?? null) !== incoming.details.grade;

    if (gradeChanged) {
      changed = true;
    }

    return changed;
  }
}

export const bulkUpdateService = new BulkUpdateService();
