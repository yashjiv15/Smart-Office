import { NextApiRequest, NextApiResponse } from 'next';
import { connectDB } from '../config/db';
import User from '../models/User';
import Role from '../models/Role';
import bcrypt from 'bcryptjs';

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
  if (req.method === 'POST') {
    const sessionEmail = req.headers['session-email'];

    let { first_name, last_name, email, mobile, password, user_role } = req.body;
    if (!sessionEmail) {
      return res.status(401).json({ message: 'Session email is missing' });
    }

    try {
      // Convert first_name and last_name to title case
      first_name = toTitleCase(first_name);
      last_name = toTitleCase(last_name);

      // Check if user already exists
      const existingUser = await User.findOne({ where: { email } });

      if (existingUser) {
        return res.status(400).json({ message: 'User already exists' });
      }

      // Find role_id from role_name
      const role = await Role.findOne({ where: { role_name: user_role } });
      if (!role) {
        return res.status(400).json({ message: 'Invalid user role' });
      }

      const role_id = role.role_id;

      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create new user
      const newUser = await User.create({
        first_name,
        last_name,
        email,
        mobile,
        password: hashedPassword,
        user_role: role_id,
        created_by: sessionEmail
      });

      res.status(201).json({ message: 'User created successfully', user: newUser });
    } catch (error) {
      console.error('Error creating user:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}
