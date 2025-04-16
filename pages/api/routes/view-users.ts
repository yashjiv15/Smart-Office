import { NextApiRequest, NextApiResponse } from 'next';
import { connectDB } from '../config/db';
import User from '../models/User';
import Role from '../models/Role';

connectDB();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const users = await User.findAll({
        where: {
          is_deleted: false, // Add this condition to filter users
        },
        include: [{
          model: Role,
          as: 'role',
          attributes: ['role_name'],
        }],
        attributes: { exclude: ['password'] }, // Exclude password from query
      });

      // Transform the data to include the role name
      const usersWithRoleNames = users.map(user => ({
        ...user.toJSON(),
        user_role: user.role ? user.role.role_name : null, // Check if role is defined
      }));

      res.status(200).json(usersWithRoleNames);
    } catch (error) {
      console.error('Error fetching users:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}
