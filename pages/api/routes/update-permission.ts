import { NextApiRequest, NextApiResponse } from 'next';
import { connectDB } from '../config/db';
import Permission from '../models/Permission';

connectDB();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'PUT') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const sessionEmail = req.headers['session-email'];
  const { permission_title, new_permission_title } = req.body;

  if (!sessionEmail) {
    return res.status(401).json({ message: 'Session email is missing' });
  }

  if (!permission_title || !new_permission_title) {
    return res.status(400).json({ message: 'Both old and new permission titles are required' });
  }

  try {
    // Check if the permission with the old title exists
    const existingPermissions = await Permission.findAll({
      where: { permission_title },
    });

    if (existingPermissions.length === 0) {
      return res.status(404).json({ message: 'Permission not found' });
    }

    // Check if the new permission title already exists
    const duplicatePermissions = await Permission.findAll({
      where: { permission_title: new_permission_title },
    });

    if (duplicatePermissions.length > 0) {
      return res.status(400).json({ message: 'Permission with the new title already exists' });
    }

    // Convert new_permission_title to lowercase and create CRUD permission names
    const baseNewPermissionName = new_permission_title.toLowerCase().replace(/ /g, '_');

    // Update each permission's title and name
    await Promise.all(existingPermissions.map(async (permission) => {
      const action = permission.permission_name.split('_')[0]; // Extract action from current permission name
      await Permission.update(
        {
          permission_title: new_permission_title,
          permission_name: `${action}_${baseNewPermissionName}`,
          updated_by: sessionEmail,
        },
        {
          where: {
            permission_name: permission.permission_name,
          }
        }
      );
    }));

    return res.status(200).json({ message: 'Permission updated successfully' });
  } catch (error) {
    console.error('Error updating permissions:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}
