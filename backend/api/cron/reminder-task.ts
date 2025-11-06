import { remainderService } from '../../src/services/remainder-service.js';

export const config = {
  schedule: '*/60 * * * *', // every 60 minutes
};

export default async function handler(_req: any, res: any) {
  console.log('Cron job running...');
  await remainderService.triggerReminders();
  return res.status(200).json({ ok: true });
}
