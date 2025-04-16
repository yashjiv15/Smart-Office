// src/app/api/add-document.ts

import { NextApiRequest, NextApiResponse } from 'next';
import { connectDB } from '../config/db';
import Document from '../models/Document';

connectDB();



export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const sessionEmail = req.headers['session-email'];
  const { document_name } = req.body;

  if (!sessionEmail) {
    return res.status(401).json({ message: 'Session email is missing' });
  }

  if (!document_name) {
    return res.status(400).json({ message: 'Document name is required' });
  }

  try {
    // Convert document_name to title case
    const formattedDocumentName = document_name
    .toLowerCase()
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

    // Check if document already exists
    const existingDocument = await Document.findOne({ where: { document_name: formattedDocumentName } });

    if (existingDocument) {
      return res.status(400).json({ message: 'Document already exists' });
    }

    // Create new document
    const newDocument = await Document.create({
      document_name: formattedDocumentName,
      created_by: sessionEmail,
      is_deleted: false,
    });

    return res.status(201).json({ message: 'Document created successfully', document: newDocument });
  } catch (error) {
    console.error('Error creating document:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}
