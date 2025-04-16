// src/app/api/add-role-permission.ts

import { NextApiRequest, NextApiResponse } from 'next';
import { connectDB } from '../config/db';
import RolePermission from '../models/RolePermission';
import Role from '../models/Role';

connectDB();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const sessionEmail = req.headers['session-email'];
  const { role_name, permissions } = req.body;

  if (!sessionEmail) {
    return res.status(401).json({ message: 'Session email is missing' });
  }

  if (!role_name || !Array.isArray(permissions)) {
    return res.status(400).json({ message: 'Role name and an array of permissions are required' });
  }

  try {
    // Get the role_id by role_name
    const role = await Role.findOne({ where: { role_name } });
    if (!role) {
      return res.status(404).json({ message: 'Role not found' });
    }
    const role_id = role.role_id;

    // Fetch existing role permissions
    const existingRolePermissions = await RolePermission.findAll({ where: { role_id } });

    // Update existing permissions and identify permissions to be added
    await Promise.all(existingRolePermissions.map(async existingPermission => {
      if (permissions.includes(existingPermission.permission_name)) {
        // Update only updated_by for existing permissions
        await RolePermission.update(
          { updated_by: sessionEmail },
          { where: { role_id, permission_name: existingPermission.permission_name } }
        );
      } else {
        // Soft delete permissions not in the new list
        await RolePermission.update(
          { is_deleted: true },
          { where: { role_id, permission_name: existingPermission.permission_name } }
        );
      }
    }));

    // Add new permissions
    const existingPermissionNames = existingRolePermissions.map(p => p.permission_name);
    const newPermissions = permissions.filter(permission => !existingPermissionNames.includes(permission));

    const newPermissionsData = newPermissions.map(permission => ({
      role_id,
      permission_name: permission,
      created_by: sessionEmail,
      is_deleted: false,
    }));

    if (newPermissionsData.length) {
      await RolePermission.bulkCreate(newPermissionsData);
    }

    return res.status(201).json({ message: 'Permissions added and updated successfully' });
  } catch (error) {
    console.error('Error adding and updating role permissions:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}
