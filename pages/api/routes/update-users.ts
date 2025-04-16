// src/app/api/routes/update-user.ts

import { NextApiRequest, NextApiResponse } from 'next';
import { connectDB } from '../config/db';
import User from '../models/User';
import Role from '../models/Role';

connectDB();

// Function to convert a string to title case
const toTitleCase = (str: string) => {
  return str
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'PUT') {
    const { first_name, last_name, email, mobile, user_role } = req.body;
    const sessionEmail = req.headers['session-email'];

    if (!sessionEmail) {
      return res.status(401).json({ message: 'Session email is missing' });
    }

    try {
      // Check if user already exists by email
      let existingUser = await User.findOne({ where: { email } });

      if (!existingUser) {
        // If user doesn't exist by email, check by mobile
        existingUser = await User.findOne({ where: { mobile } });

        if (!existingUser) {
          // If neither email nor mobile exists, return an error
          return res.status(404).json({ message: 'User not found' });
        }
      }

      // Convert first_name and last_name to title case
      const updatedFirstName = toTitleCase(first_name);
      const updatedLastName = toTitleCase(last_name);

      // Find role_id from role_name
      const role = await Role.findOne({ where: { role_name: user_role } });
      if (!role) {
        return res.status(400).json({ message: 'Invalid user role' });
      }

      const role_id = role.role_id;

      // Update user fields
      const updatedUser = await existingUser.update({
        first_name: updatedFirstName,
        last_name: updatedLastName,
        email,
        mobile,
        user_role: role_id,
        updated_by: sessionEmail,
      });

      res.status(200).json({ message: 'User updated successfully', user: updatedUser });
    } catch (error) {
      console.error('Error updating user:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}
