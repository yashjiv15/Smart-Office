import { NextApiRequest, NextApiResponse } from 'next';
import { connectDB } from '../config/db';
import WorkMaster from '../models/WorkMaster';

connectDB();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'PUT') {
    const sessionEmail = req.headers['session-email'];

    if (!sessionEmail) {
      return res.status(401).json({ message: 'Session email is missing' });
    }

    const {
      work_master_id,
      work_document,
      work_cost,
      work_master,
    } = req.body;

    try {
      const workmaster = await WorkMaster.findByPk(work_master_id);
      if (!workmaster) {
        return res.status(404).json({ message: 'WorkMaster not found' });
      }

      // Format work_master
      let formattedWorkMaster = work_master.replace(/[-/,]/g, ' ').split(' ').map(word => 
        word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
      ).join(' ');

      await workmaster.update({
        work_master: formattedWorkMaster,
        work_document,
        work_cost,
        updated_by: sessionEmail,
      });

      return res.status(200).json({ message: 'WorkMaster updated successfully', workmaster });
    } catch (error) {
      console.error('Error updating workmaster:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  } else {
    res.status(405).json({ message: `Method ${req.method} not allowed` });
  }
}
