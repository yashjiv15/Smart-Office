// src/app/api/delete-document.ts

import { NextApiRequest, NextApiResponse } from 'next';
import { connectDB } from '../config/db';
import Document from '../models/Document';

connectDB();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'DELETE') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const sessionEmail = req.headers['session-email'];

  if (!sessionEmail) {
    return res.status(401).json({ message: 'Session email is missing' });
  }

  const { document_name } = req.body;

  if (!document_name) {
    return res.status(400).json({ message: 'Document name is required' });
  }

  try {
    // Find the document by name
    const document = await Document.findOne({ where: { document_name } });

    if (!document) {
      return res.status(404).json({ message: 'Document not found' });
    }

    // Soft delete the document
    document.is_deleted = true;
    await document.save();

    return res.status(200).json({ message: 'Document deleted successfully' });
  } catch (error) {
    console.error('Error deleting document:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}
