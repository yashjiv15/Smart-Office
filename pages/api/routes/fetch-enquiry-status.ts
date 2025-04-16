import { NextApiRequest, NextApiResponse } from 'next';
import { connectDB } from '../config/db';
import Status from '../models/Status';

connectDB();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const statuses = await Status.findAll({
        where: {
          status_for: 'enquiry_status',
        },
      });

      if (statuses.length > 0) {
        res.status(200).json(statuses);
      } else {
        res.status(404).json({ message: 'No statuses found for enquiry_status' });
      }
    } catch (error) {
      console.error('Error fetching enquiry statuses:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}
