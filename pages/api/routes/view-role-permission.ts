import { NextApiRequest, NextApiResponse } from 'next';
import { connectDB } from '../config/db';
import RolePermission from '../models/RolePermission';
import Role from '../models/Role';
import Permission from '../models/Permission';
import defineAssociations from '../models/associations';

connectDB();
defineAssociations();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { role_name } = req.body;

  if (!role_name) {
    return res.status(400).json({ message: 'Role name is required' });
  }

  try {
    // Get the role_id by role_name
    const role = await Role.findOne({ where: { role_name } });
    if (!role) {
      return res.status(404).json({ message: 'Role not found' });
    }
    const role_id = role.role_id;

    // Fetch permissions associated with the role
    const rolePermissions = await RolePermission.findAll({
      where: { role_id, is_deleted: false },
      include: [
        {
          model: Permission,
          attributes: ['permission_name'],
        },
      ],
    });

    const permissions = rolePermissions.map(rp => rp.Permission.permission_name);

    return res.status(200).json({ permissions });
  } catch (error) {
    console.error('Error fetching role permissions:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}
