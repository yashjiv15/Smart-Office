import { NextApiRequest, NextApiResponse } from 'next';
import WorkTask from '../models/WorkTask';
import WorkMaster from '../models/WorkMaster'; // Ensure you have the WorkMaster model imported
import Status from '../models/Status'; // Ensure you have the Status model imported
import { connectDB, sequelize } from '../config/db';

connectDB();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'PUT') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const sessionEmail = req.headers['session-email'];

  if (!sessionEmail) {
    return res.status(401).json({ message: 'Session email is missing' });
  }

  const transaction = await sequelize.transaction();

  try {
    const { work_id, work_master, work_documents, work_task_status } = req.body;

    // Fetch the WorkMaster based on work_master name
    const workMasterRecord = await WorkMaster.findOne({
      where: {
        work_master,
      },
    });

    if (!workMasterRecord) {
      throw new Error('Work master not found');
    }

    const work_master_id = workMasterRecord.getDataValue('work_master_id');

    // Fetch the WorkTask based on work_id and work_master_id
    const workTask = await WorkTask.findOne({
      where: {
        work_id,
        work_master_id,
      },
    });

    if (!workTask) {
      throw new Error('Work task not found');
    }

    const updateData: any = {
      updated_by: sessionEmail,
      updated_at: new Date(),
    };

    if (work_documents) {
      updateData.work_document_vs_customer_document = work_documents;
    }

    if (work_task_status) {
      // Fetch the corresponding status_id from the Status model
      const status = await Status.findOne({
        where: {
          status_for: 'work_task_status',
          status: work_task_status,
        },
      });

      if (!status) {
        throw new Error('Invalid work_task_status');
      }

      const status_id = status.getDataValue('status_id');
      updateData.work_task_status = status_id;
    }

    // Update the WorkTask model
    await WorkTask.update(
      updateData,
      {
        where: { work_task_id: workTask.work_task_id },
        transaction,
      }
    );

    await transaction.commit();

    res.status(200).json({ message: 'Work task updated successfully' });
  } catch (error) {
    await transaction.rollback();
    res.status(400).json({ message: error.message });
  }
}
