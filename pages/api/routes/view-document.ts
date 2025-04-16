// src/app/api/view-document.ts

import { NextApiRequest, NextApiResponse } from 'next';
import { connectDB } from '../config/db';
import Document from '../models/Document';
import User from '../models/User';

connectDB();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // Retrieve documents from the database
    const documents = await Document.findAll({
      where: { is_deleted: false },
      raw: true, // Use raw query to simplify mapping
    });

    // Collect unique emails from created_by and updated_by fields
    const emails: string[] = [];
    documents.forEach(doc => {
      if (doc.created_by && !emails.includes(doc.created_by)) {
        emails.push(doc.created_by);
      }
      if (doc.updated_by && !emails.includes(doc.updated_by)) {
        emails.push(doc.updated_by);
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

    // Map documents to include full name for created_by and updated_by
    const response = documents.map(doc => ({
      ...doc,
      created_by: userMap[doc.created_by] || doc.created_by,
      updated_by: userMap[doc.updated_by] || doc.updated_by,
    }));

    console.log('Fetched Documents:', response); // Log data to verify
    return res.status(200).json({ documents: response });
  } catch (error) {
    console.error('Error retrieving documents:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}
