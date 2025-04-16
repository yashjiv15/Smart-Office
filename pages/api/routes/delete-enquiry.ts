// src/app/api/delete-enquiry.ts

import { NextApiRequest, NextApiResponse } from 'next';
import { connectDB } from '../config/db';
import Enquiry from '../models/Enquiry';

connectDB();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'DELETE') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const sessionEmail = req.headers['session-email'];

  if (!sessionEmail) {
    return res.status(401).json({ message: 'Session email is missing' });
  }

  const { enquiry_id } = req.body;

  if (!enquiry_id) {
    return res.status(400).json({ message: 'Enquiry ID is required' });
  }

  try {
    // Find the enquiry by ID
    const enquiry = await Enquiry.findOne({ where: { enquiry_id } });

    if (!enquiry) {
      return res.status(404).json({ message: 'Enquiry not found' });
    }

    // Soft delete the enquiry
    enquiry.is_deleted = true;
    await enquiry.save();

    return res.status(200).json({ message: 'Enquiry deleted successfully' });
  } catch (error) {
    console.error('Error deleting enquiry:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}
