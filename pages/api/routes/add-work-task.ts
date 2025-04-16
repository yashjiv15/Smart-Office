import { NextApiRequest, NextApiResponse } from 'next';
import WorkTask from '../models/WorkTask';
import Status from '../models/Status';
import User from '../models/User';
import WorkMaster from '../models/WorkMaster';
import Work from '../models/Work';
import { connectDB } from '../config/db';
import defineAssociations from '../models/associations';

connectDB();
defineAssociations();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const sessionEmail = req.headers['session-email'];
      const { work_id, work_master, first_name, last_name } = req.body;

      if (!sessionEmail) {
        return res.status(401).json({ message: 'Session email is missing' });
      }

      // Fetch the status_id for 'Pending' status where status_for is 'work_task_status'
      const pendingStatus = await Status.findOne({
        where: {
          status: 'Pending',
          status_for: 'work_task_status',
        },
      });

      if (!pendingStatus) {
        return res.status(400).json({ message: 'Pending status not found' });
      }

      // Fetch the work_master_id based on the work_master name
      const workMasterRecord = await WorkMaster.findOne({
        where: { work_master },
      });

      if (!workMasterRecord) {
        return res.status(400).json({ message: 'Work master not found' });
      }

      const workMasterId = workMasterRecord.work_master_id; // Use the work_master_id from the WorkMaster record

      // Fetch the user details for the work owner based on first name and last name
      const workOwner = await User.findOne({ where: { first_name, last_name } });
      if (!workOwner) {
        return res.status(400).json({ message: 'Work owner not found' });
      }

      const workOwnerEmail = workOwner.email; // Fetch the work owner's email

      // Check if the work_master is already assigned to any user
      const existingAssignment = await WorkTask.findOne({
        where: {
          work_id,
          work_master_id: workMasterId,
        },
      });

      if (existingAssignment) {
        if (existingAssignment.is_assigned) {
          return res.status(400).json({ message: 'This work task is already assigned' });
        } else {
          // Ensure work_owner is handled as an array
          const currentOwners = Array.isArray(existingAssignment.work_owner) ? existingAssignment.work_owner : [];
          const updatedWorkOwners = [...currentOwners, workOwnerEmail];
          console.log('Updating work owners to:', updatedWorkOwners);
      
          await existingAssignment.update({
            work_owner: updatedWorkOwners,
            is_assigned: true,
            updated_by: sessionEmail,
          });
      
          // Check if all work tasks are assigned and update the work status if true
          await updateWorkStatus(work_id);

          return res.status(200).json({ message: 'Work task reassigned successfully' });
        }
      }

      // Create a new work task
      const newWorkTask = await WorkTask.create({
        work_id,
        work_master_id: workMasterId,
        work_owner: [workOwnerEmail], // Ensure this is an array
        work_task_status: pendingStatus.status_id,
        created_by: sessionEmail,
        created_at: new Date(),
        is_assigned: true,
      });
      console.log('Created new work task:', newWorkTask);

      // Check if all work tasks are assigned and update the work status if true
      await updateWorkStatus(work_id);

      res.status(201).json(newWorkTask);
    } catch (error) {
      console.error('Error assigning work task:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}

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
