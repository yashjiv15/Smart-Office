//routes/add-roles.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { connectDB } from '../config/db';
import Role from '../models/Role';

connectDB();

// Function to convert a string to title case and replace spaces with hyphens
const formatRoleName = (str: string) => {
  return str
    .trim() // Remove leading and trailing spaces
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join('-'); // Join words with hyphens
};


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const sessionEmail = req.headers['session-email'];

    let { role_name } = req.body;
    console.log(role_name);
    if (!sessionEmail) {
      return res.status(401).json({ message: 'Session email is missing' });
    }

    try {
      // Convert role_name to title case with hyphens
      role_name = formatRoleName(role_name);

      // Check if Role already exists
      const existingUser = await Role.findOne({ where: { role_name } });

      if (existingUser) {
        return res.status(400).json({ message: 'Role already exists' });
      }

      // Create new Role
      const newRole = await Role.create({
        role_name,
        created_by: sessionEmail
      });

      res.status(201).json({ message: 'Role created successfully', Role: newRole });
    } catch (error) {
      console.error('Error creating Role:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}
