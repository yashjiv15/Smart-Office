import { NextApiRequest, NextApiResponse } from 'next';
import { connectDB } from '../config/db';
import Role from '../models/Role';

connectDB();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'DELETE') {
    const { role_name } = req.body;

    if (!role_name) {
      return res.status(400).json({ message: 'role_name is required' });
    }

    try {
      const role = await Role.findOne({ where: { role_name } });

      if (!role) {
        return res.status(404).json({ message: 'role not found' });
      }

      role.is_deleted = true;
      await role.save();

      res.status(200).json({ message: 'role deleted successfully' });
    } catch (error) {
      console.error('Error deleting role:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}
