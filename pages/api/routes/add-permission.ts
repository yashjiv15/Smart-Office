// src/app/api/add-permission.ts

import { NextApiRequest, NextApiResponse } from 'next';
import { connectDB } from '../config/db';
import Permission from '../models/Permission';

connectDB();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const sessionEmail = req.headers['session-email'];
  const { permission_title } = req.body;

  if (!sessionEmail) {
    return res.status(401).json({ message: 'Session email is missing' });
  }

  if (!permission_title) {
    return res.status(400).json({ message: 'Permission title is required' });
  }

  try {
    // Convert permission_title to lowercase and create CRUD permission names
    const basePermissionName = permission_title.toLowerCase().replace(/ /g, '_');
    const permissions = ['create', 'update', 'view', 'delete'].map(action => ({
      permission_name: `${action}_${basePermissionName}`,
      permission_title, // Keep the same title for all CRUD operations
      created_by: sessionEmail,
      is_deleted: false,
    }));

    // Check if any permission with the same title already exists
    const existingPermissions = await Permission.findAll({
      where: {
        permission_title,
      },
    });

    if (existingPermissions.length > 0) {
      return res.status(400).json({ message: 'Permission with the given title already exists' });
    }

    // Create new permissions
    const newPermissions = await Permission.bulkCreate(permissions);

    return res.status(201).json({ message: 'Permissions created successfully', permissions: newPermissions });
  } catch (error) {
    console.error('Error creating permissions:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}
