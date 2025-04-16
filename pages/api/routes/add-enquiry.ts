import { NextApiRequest, NextApiResponse } from 'next';
import { connectDB } from '../config/db';
import Customer from '../models/Customer';
import Enquiry from '../models/Enquiry';
import Status from '../models/Status';

connectDB();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const sessionEmail = req.headers['session-email'];
    const { customer_id, work_enquiry } = req.body;

    try {
      // Check if customer_id is valid
      if (!customer_id || isNaN(parseInt(customer_id))) {
        return res.status(400).json({ error: 'Invalid customer_id' });
      }
    
      // Convert work_enquiry array to JSON object
      const workEnquiryJSON = JSON.stringify(work_enquiry);

      // Fetch the status_id for 'Pending' status
      const status = await Status.findOne({ where: { status: 'Pending' } });
      if (!status) {
        return res.status(500).json({ error: 'Failed to find Pending status' });
      }

      // Create the enquiry with Sequelize
      const enquiry = await Enquiry.create({
        customer_id: parseInt(customer_id), // Ensure this is a valid integer
        work_enquiry: JSON.parse(workEnquiryJSON), // Parse back to JSON object
        enquiry_status: status.status_id, // Use status_id for Pending
        created_by: sessionEmail,
      });

      res.status(201).json(enquiry);
    } catch (error) {
      console.error('Error adding enquiry:', error);
      res.status(500).json({ message: 'Failed to add enquiry' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
