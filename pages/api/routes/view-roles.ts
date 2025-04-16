// src/app/api/routes/view-roles.ts

import { NextApiRequest, NextApiResponse } from 'next';
import { connectDB } from '../config/db';
import Role from '../models/Role';
import User from '../models/User';

connectDB();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    const roles = await Role.findAll({
      where: { is_deleted: false },
      raw: true, // Use raw query to simplify mapping
    });

    // Collect unique emails from created_by and updated_by fields
    const emails: string[] = [];
    roles.forEach(role => {
      if (role.created_by && !emails.includes(role.created_by)) {
        emails.push(role.created_by);
      }
      if (role.updated_by && !emails.includes(role.updated_by)) {
        emails.push(role.updated_by);
      }
    });

    // Find all users with these emails
    const users = await User.findAll({
      where: {
        email: emails,
      },
      attributes: ['email', 'first_name', 'last_name'],
      raw: true,
    });

    // Create a map for quick lookup of user's full name by email
    const userMap: { [key: string]: string } = {};
    users.forEach(user => {
      userMap[user.email] = `${user.first_name} ${user.last_name}`;
    });

    // Map roles to include full name for created_by and updated_by
    const response = roles.map(role => ({
      ...role,
      created_by: userMap[role.created_by] || role.created_by,
      updated_by: userMap[role.updated_by] || role.updated_by,
    }));

    console.log('Fetched roles:', response); // Log data to verify
    return res.status(200).json(response);
  } catch (error) {
    console.error('Error fetching roles:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}
