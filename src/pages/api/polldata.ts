import type { NextApiRequest, NextApiResponse } from 'next';
const setupCronJob =require( '../../../utils/cronjob');

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  setupCronJob();
  res.status(200).json({ message: 'Cron job set up successfully' });
}