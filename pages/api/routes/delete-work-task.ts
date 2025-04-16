import { NextApiRequest, NextApiResponse } from 'next';
import WorkTask from '../models/WorkTask';
import WorkMaster from '../models/WorkMaster';
import Work from '../models/Work'; // Import Work model
import Status from '../models/Status'; // Import Status model
import { connectDB } from '../config/db';
import defineAssociations from '../models/associations';

connectDB();
defineAssociations();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const sessionEmail = req.headers['session-email'];
      const { work_id, work_master } = req.body;

      if (!sessionEmail) {
        return res.status(401).json({ message: 'Session email is missing' });
      }

      // Fetch the work_master_id based on the work_master name
      const workMasterRecord = await WorkMaster.findOne({
        where: { work_master },
      });

      if (!workMasterRecord) {
        return res.status(400).json({ message: 'Work master not found' });
      }

      const workMasterId = workMasterRecord.work_master_id;

      // Check if the work_master is already assigned to any user
      const existingAssignment = await WorkTask.findOne({
        where: {
          work_id,
          work_master_id: workMasterId,
          is_assigned: true,
        },
      });

      if (!existingAssignment) {
        return res.status(400).json({ message: 'This work task is not assigned' });
      }

      // Update work task to revoke the current owner and mark as not assigned
      await existingAssignment.update({
        is_assigned: false,
        updated_by: sessionEmail,
      });

      // Update the work status based on the revocation
      await updateWorkStatus(work_id);

      res.status(200).json({ message: 'Work task revoked successfully' });
    } catch (error) {
      console.error('Error revoking work task:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}

// Function to update the work status based on task assignments
async function updateWorkStatus(work_id: number) {
  // Fetch the status_id for 'Assigned' and 'Unassigned' statuses where status_for is 'work_status'
  const assignedStatus = await Status.findOne({
    where: {
      status: 'Assigned',
      status_for: 'work_status',
    },
  });

  const unassignedStatus = await Status.findOne({
    where: {
      status: 'Unassigned',
      status_for: 'work_status',
    },
  });

  if (!assignedStatus || !unassignedStatus) {
    throw new Error('Assigned or Unassigned status not found');
  }

  // Fetch all work tasks for the given work_id
  const workTasks = await WorkTask.findAll({
    where: { work_id },
  });

  // Check if any work task is not assigned
  const allAssigned = workTasks.every(task => task.is_assigned);

  // Update the work_status of the given work_id
  await Work.update(
    { work_status: allAssigned ? assignedStatus.status_id : unassignedStatus.status_id },
    { where: { work_id } }
  );
}
