import { NextApiRequest, NextApiResponse } from 'next';
import { connectDB } from '../config/db';
import Enquiry from '../models/Enquiry';
import Status from '../models/Status';
import Work from '../models/Work';

connectDB();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'PUT') {
    const { enquiry_id, new_status } = req.body;
    const sessionEmail = req.headers['session-email'];

    if (!sessionEmail) {
      return res.status(401).json({ message: 'Session email is missing' });
    }

    if (!enquiry_id || !new_status) {
      return res.status(400).json({ message: 'Enquiry ID and new status are required' });
    }

    try {
      // Check if the enquiry exists
      const enquiry = await Enquiry.findOne({ where: { enquiry_id } });
      if (!enquiry) {
        return res.status(404).json({ message: 'Enquiry not found' });
      }

      // Check if the new status exists and get its status_id
      const newStatus = await Status.findOne({ where: { status: new_status } });
      if (!newStatus) {
        return res.status(404).json({ message: 'Status not found' });
      }

      const newStatusId = newStatus.status_id;

      // Update the enquiry_status and updated_by fields in the Enquiry table
      await Enquiry.update(
        {
          enquiry_status: newStatusId,
          updated_by: sessionEmail,
          updated_at: new Date(),
        },
        { where: { enquiry_id } }
      );

      // If the new status is "Approved", insert a record into the so_work table
      if (new_status === 'Approved') {
        const unassignedStatus = await Status.findOne({ where: { status: 'Unassigned' } });
        if (!unassignedStatus) {
          return res.status(404).json({ message: 'Unassigned status not found' });
        }

        await Work.create({
          enquiry_id,
          created_by: sessionEmail,
          work_status: unassignedStatus.status_id,  // Set work_status to the status_id of "Unassigned"
        });
      }

      return res.status(200).json({ message: 'Enquiry status updated successfully' });
    } catch (error) {
      console.error('Error updating enquiry status:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  } else {
    return res.status(405).json({ message: 'Method not allowed' });
  }
}
