import { NextApiRequest, NextApiResponse } from 'next';
import { connectDB } from '../config/db';
import Permission from '../models/Permission';

connectDB();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'DELETE') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { permission_title } = req.body;

  if (!permission_title) {
    return res.status(400).json({ message: 'Permission title is required' });
  }

  try {
    const permissions = await Permission.findAll({
      where: { permission_title, is_deleted: false }
    });

    if (permissions.length === 0) {
      return res.status(404).json({ message: 'Permission not found' });
    }

    for (const permission of permissions) {
      permission.is_deleted = true;
      await permission.save();
    }

    return res.status(200).json({ message: 'Permissions deleted successfully' });
  } catch (error) {
    console.error('Error deleting permissions:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}
