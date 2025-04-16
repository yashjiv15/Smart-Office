// src/app/api/update-document.ts

import { NextApiRequest, NextApiResponse } from 'next';
import { connectDB } from '../config/db';
import Document from '../models/Document';

connectDB();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'PUT') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const sessionEmail = req.headers['session-email'];
  const { document_name, old_document_name } = req.body;

  if (!sessionEmail) {
    return res.status(401).json({ message: 'Session email is missing' });
  }

  if (!document_name || !old_document_name) {
    return res.status(400).json({ message: 'Document name and old document name are required' });
  }

  try {
    // Find the document by old_document_name
    const document = await Document.findOne({
      where: {
        document_name: old_document_name,
      },
    });

    if (!document) {
      return res.status(404).json({ message: 'Document not found' });
    }

    // Update the document fields
    const updatedDocument = await document.update({
      document_name,
      updated_by: sessionEmail,
      updated_at: new Date(),
    });

    return res.status(200).json({ message: 'Document updated successfully', document: updatedDocument });
  } catch (error) {
    console.error('Error updating document:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}
