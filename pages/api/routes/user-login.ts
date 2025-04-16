import { NextApiRequest, NextApiResponse } from 'next';
import { connectDB } from '../config/db';
import User from '../models/User';
import RolePermission from '../models/RolePermission';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import cookie from 'cookie';

connectDB();

// Secret key for JWT signing (change this to a secure random key)
const JWT_SECRET = '45!2ssgdyug';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { email, password } = req.body;

    try {
      // Example logic: Find user by email and verify password
      const user = await User.findOne({ where: { email } });

      if (!user) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      const passwordMatch = await bcrypt.compare(password, user.password);

      if (!passwordMatch) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

   // Fetch permissions based on the user’s role and ensure is_deleted is false
const permissions = await RolePermission.findAll({
  where: {
    role_id: user.user_role,
    is_deleted: false // Add this condition to check for non-deleted permissions
  },
  attributes: ['permission_name']
});


      const permissionsArray = permissions.map(p => p.permission_name);

      // Generate JWT token
      const token = jwt.sign({ email, permissions: permissionsArray }, JWT_SECRET, {
        expiresIn: '1h' // Token expires in 1 hour, adjust as needed
      });

      // Set the token as a cookie
      res.setHeader('Set-Cookie', cookie.serialize('auth_token', token, {
        httpOnly: true, // Cookie is only accessible via HTTP(S)
        maxAge: 3600 * 24, // Cookie expires in 24 hour hour (in seconds)
        sameSite: 'strict', // Restricts cross-site access
        secure: process.env.NODE_ENV === 'production' // Set secure in production
      }));

      res.status(200).json({ message: 'Login successful', permissions: permissionsArray });
    } catch (error) {
      console.error('Error during login:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}
