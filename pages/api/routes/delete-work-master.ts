import { NextApiRequest, NextApiResponse } from 'next';
import { connectDB } from '../config/db';
import WorkMaster from '../models/WorkMaster';

connectDB();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'DELETE') {
    const sessionEmail = req.headers['session-email'];

    if (!sessionEmail) {
         return res.status(401).json({ message: 'Session email is missing' });
       }
    const { work_master_id } = req.body;

    if (!work_master_id) {
      return res.status(400).json({ message: 'work_master_id is required' });
    }

    try {
      const work_master = await WorkMaster.findOne({ where: { work_master_id } });

      if (!work_master) {
        return res.status(404).json({ message: 'work_master not found' });
      }

      work_master.is_deleted = true;
      await work_master.save();

      res.status(200).json({ message: 'work_master deleted successfully' });
    } catch (error) {
      console.error('Error deleting work_master:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}
