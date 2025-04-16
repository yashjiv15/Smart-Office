import { NextApiRequest, NextApiResponse } from 'next';
import { connectDB } from '../config/db';
import Permission from '../models/Permission';

connectDB();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const permissions = await Permission.findAll({
        where: {
          is_deleted: false,
        },
      });

      // Group permissions by title
      const groupedPermissions = {};
      permissions.forEach((permission) => {
        if (!groupedPermissions[permission.permission_title]) {
          groupedPermissions[permission.permission_title] = [];
        }
        groupedPermissions[permission.permission_title].push(permission.permission_name);
      });

      res.status(200).json(groupedPermissions);
    } catch (error) {
      console.error('Error fetching permissions:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}