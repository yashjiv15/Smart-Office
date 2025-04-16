import { NextApiRequest, NextApiResponse } from 'next';
import { connectDB } from '../config/db';
import WorkMaster from '../models/WorkMaster';
import User from '../models/User';

connectDB();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const workMasters: WorkMaster[] = await WorkMaster.findAll({
        where: {
          is_deleted: false, // Add this condition to filter users
        },
        raw: true, // Use raw query to simplify mapping
      });

      // Collect unique email addresses from created_by and updated_by fields
      const emails: string[] = [];
      workMasters.forEach(wm => {
        if (wm.created_by && !emails.includes(wm.created_by)) {
          emails.push(wm.created_by);
        }
        if (wm.updated_by && !emails.includes(wm.updated_by)) {
          emails.push(wm.updated_by);
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

      // Map workMasters to include full name for created_by and updated_by
      const response = workMasters.map(wm => ({
        ...wm,
        created_by: userMap[wm.created_by] || wm.created_by,
        updated_by: userMap[wm.updated_by] || wm.updated_by,
      }));

      console.log('Fetched WorkMasters:', response); // Log data to verify
      res.status(200).json(response);
    } catch (error) {
      console.error('Error fetching WorkMasters:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}
