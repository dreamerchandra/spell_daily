import { testCodeModel } from '../../src/model/test-code-model.js';
import { bot } from '../../src/services/telegram-bot-service.js';

export const config = {
  schedule: '0 20 * * 1,3,5,0', // 8 PM on Mon, Wed, Fri, Sun
};

function formatDateDDMMYYYY(date: Date): string {
  const d = new Date(date);
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
}

const getUserString = (user: {
  name?: string;
  parentName?: string;
  testCode?: string;
  phoneNumber?: string;
  lastCompletedDate: Date | null;
}): string => {
  const phone = user.phoneNumber ?? 'N/A';

  return `Name: ${user.name ?? 'N/A'}
Parent: ${user.parentName ?? 'N/A'}
Test Code: ${user.testCode ?? 'N/A'}
Phone: +91${phone}
Last Completed Date: ${
    user.lastCompletedDate ? formatDateDDMMYYYY(user.lastCompletedDate) : 'N/A'
  }`;
};

export default async function handler(_req: any, res: any) {
  console.log('Cron job running...');

  const dictUsers = await testCodeModel.getDormantUsers({
    lastAccess: 1 as unknown as Date,
    status: 'FREE_TRIAL',
  });

  let report = `Dormant Users Report:\n\n`;

  report += `=== DICTATION USERS ===\n`;
  report += dictUsers.length
    ? dictUsers.map(getUserString).join('\n\n')
    : 'None';
  report += `\n\n`;
  await bot.sendMessage(4892692975, report, { parse_mode: 'HTML' });
  return res.status(200).json({ ok: true });
}
