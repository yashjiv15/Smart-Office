import { NextApiRequest, NextApiResponse } from 'next';
import { connectDB } from '../config/db';
import Role from '../models/Role';
import User from '../models/User';

connectDB();

// Function to convert a string to title case and replace spaces with hyphens
const formatRoleName = (str: string) => {
  return str
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join('-');
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'PUT') {
    const { role_name, old_role_name } = req.body;
    console.log(role_name, old_role_name);
    const sessionEmail = req.headers['session-email'];

    if (!sessionEmail) {
      return res.status(401).json({ message: 'Session email is missing' });
    }

    try {
      // Check if old_role_name exists in the Role table
      const role = await Role.findOne({ where: { role_name: old_role_name } });
      if (!role) {
        return res.status(404).json({ message: 'Old role name not found' });
      }

      const roleId = role.role_id;

      // Update user-role to "41" where role_id matches in the User model
      await User.update(
        { user_role: 41 },
        { where: { user_role: roleId } }
      );

      // Update the role_name and updated_by in the Role table
      await Role.update(
        {
          role_name: formatRoleName(role_name),
          updated_by: sessionEmail
        },
        { where: { role_id: roleId } }
      );

      return res.status(200).json({ message: 'Role updated successfully' });
    } catch (error) {
      console.error('Error updating role:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  } else {
    return res.status(405).json({ message: 'Method not allowed' });
  }
}
