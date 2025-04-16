import { NextApiRequest, NextApiResponse } from 'next';
import { connectDB } from '../config/db';
import WorkMaster from '../models/WorkMaster';

connectDB();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const sessionEmail = req.headers['session-email'];

    let { work_master, work_document, work_cost } = req.body;
    if (!sessionEmail) {
      return res.status(401).json({ message: 'Session email is missing' });
    }

    try {
      // Format work_master
      work_master = work_master.replace(/[-/,]/g, ' ').split(' ').map(word => 
        word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
      ).join(' ');

      // Check if work master already exists
      const existingWorkMaster = await WorkMaster.findOne({ where: { work_master } });

      if (existingWorkMaster) {
        return res.status(400).json({ message: 'Work master already exists' });
      }

      // Create new work master
      const newWorkMaster = await WorkMaster.create({
        work_master,
        work_document,
        work_cost,
        created_by: sessionEmail
      });

      res.status(201).json({ message: 'Work master created successfully', workMaster: newWorkMaster });
    } catch (error) {
      console.error('Error creating work master:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}
