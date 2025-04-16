import { NextApiRequest, NextApiResponse } from 'next';
import cookie from 'cookie';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    // Clear the auth_token cookie to logout the user
    res.setHeader('Set-Cookie', cookie.serialize('auth_token', '', {
      httpOnly: true,
      expires: new Date(0), // Set the cookie to expire immediately
      sameSite: 'strict',
      secure: process.env.NODE_ENV === 'production',
      path: '/' // Include the path to ensure it clears the cookie everywhere
    }));

    res.status(200).json({ message: 'Logout successful' });
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}
