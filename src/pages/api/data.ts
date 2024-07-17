import type { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '../../../utils/dbconnect';
import Crypto from '../../../models/crypto';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { symbol } = req.query;

  if (!symbol || typeof symbol !== 'string') {
    return res.status(400).json({ message: 'Invalid symbol' });
  }

  await dbConnect();

  try {
    const data = await Crypto.find({ id: symbol }).sort({ timestamp: -1 }).limit(20).exec();
    if (data.length === 0) {
      return res.status(404).json({ message: 'Data not found' });
    }
    res.status(200).json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching data' });
  }
}


