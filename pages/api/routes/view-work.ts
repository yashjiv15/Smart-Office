import { NextApiRequest, NextApiResponse } from 'next';
import { connectDB } from '../config/db';
import defineAssociations from '../models/associations';
import Work from '../models/Work';
import Enquiry from '../models/Enquiry';
import Customer from '../models/Customer';
import WorkMaster from '../models/WorkMaster';
import Status from '../models/Status';
import WorkTask from '../models/WorkTask';
import User from '../models/User';
import Role from '../models/Role';

connectDB();
defineAssociations();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const sessionEmail = req.headers['session-email'];
      
      if (!sessionEmail) {
        return res.status(401).json({ message: 'Session email is missing' });
      }

      const sessionUser = await User.findOne({
        where: { email: sessionEmail },
        attributes: ['user_role'],
      });

      if (!sessionUser) {
        return res.status(404).json({ message: 'User not found' });
      }

      const sessionUserRole = await Role.findOne({
        where: { role_id: sessionUser.user_role },
        attributes: ['role_name'],
      });

      if (!sessionUserRole) {
        return res.status(404).json({ message: 'Role not found' });
      }

      const sessionUserRoleName = sessionUserRole.role_name;

      const statusList = await Status.findAll({
        where: { status_for: 'work_task_status' },
        attributes: ['status_id', 'status'],
      });

      const works = await Work.findAll({
        where: { is_deleted: false },
        include: [
          {
            model: Enquiry,
            attributes: ['customer_id', 'work_enquiry', 'created_at'],
            include: [
              {
                model: Customer,
                attributes: ['first_name', 'last_name'],
              },
            ],
          },
          {
            model: Status,
            attributes: ['status'],
          },
        ],
      });

      const result = await Promise.all(
        works.map(async (work) => {
          const enquiry = work.Enquiry;
          const customer = enquiry.Customer;
          const workEnquiryIds = enquiry.work_enquiry;

          const workDetails = await Promise.all(
            workEnquiryIds.map(async (id: number) => {
              const workMaster = await WorkMaster.findByPk(id);
              if (!workMaster) return null;

              const workTask = await WorkTask.findOne({
                where: {
                  work_master_id: id,
                  work_id: work.work_id,
                  is_deleted : false
                },
                attributes: [
                  'work_owner',
                  'is_assigned',
                  'created_at',
                  'updated_at',
                  'work_task_status',
                  'work_document_vs_customer_document', // Fetch the JSON field
                ],
              });

              let workOwnerName: string | null = null;
              let workOwnerRoleName: string | null = null;
              let workTaskCreatedAt: Date | null = null;
              let workTaskCompleteTime: Date | null = null;
              let lastWorkOwnerEmail: string | null = null;
              let workTaskStatusName: string | null = null;
              let workDocumentVsCustomerDocument: object | null = null; // Store the JSON field data

              if (workTask && workTask.is_assigned && workTask.work_owner) {
                if (Array.isArray(workTask.work_owner)) {
                  const workOwners = workTask.work_owner as string[];
                  lastWorkOwnerEmail = workOwners[workOwners.length - 1];
                } else {
                  lastWorkOwnerEmail = workTask.work_owner as string;
                }

                const user = await User.findOne({
                  where: { email: lastWorkOwnerEmail },
                  attributes: ['first_name', 'last_name', 'user_role'],
                });

                if (user) {
                  workOwnerName = `${user.first_name} ${user.last_name}`;

                  const workOwnerRole = await Role.findOne({
                    where: { role_id: user.user_role },
                    attributes: ['role_name'],
                  });

                  if (workOwnerRole) {
                    workOwnerRoleName = workOwnerRole.role_name;
                  }
                }

                workTaskCreatedAt = workTask.created_at;

                // Fetch the status name based on work_task_status id
                const status = await Status.findOne({
                  where: {
                    status_id: workTask.work_task_status,
                    status_for: 'work_task_status',
                  },
                  attributes: ['status'],
                });
                
                if (status) {
                  workTaskStatusName = status.status;
                  
                  // Check if the status id is 9 before assigning the complete time
                  if (workTask.work_task_status === 9) {
                    workTaskCompleteTime = workTask.updated_at;
                  } else {
                    workTaskCompleteTime = null; // or undefined, depending on your requirements
                  }
                } 

                // Store the JSON field data
                workDocumentVsCustomerDocument = workTask.work_document_vs_customer_document;
              }

              const workTaskData = {
                work_master_id: workMaster.work_master_id,
                work_master: workMaster.work_master,
                work_cost: workMaster.work_cost,
                work_documents: workMaster.work_document,
                work_owner: workOwnerName,
                work_owner_role: workOwnerRoleName,
                work_task_status: workTaskStatusName || null,
                work_task_created_at: workTaskCreatedAt,
                work_task_updated_at: workTask?.updated_at || null,
                work_task_complete_time: workTaskCompleteTime,
                work_document_vs_customer_document: workDocumentVsCustomerDocument, // Include the JSON field
                status_list: statusList,
              };

              if (
                sessionUserRoleName !== 'Super-admin' &&
                sessionUserRoleName !== 'Admin' &&
                sessionUserRoleName !== 'Manager' &&
                (!workTask?.is_assigned || lastWorkOwnerEmail !== sessionEmail)
              ) {
                return null;
              }

              return workTaskData;
            })
          );

          const filteredWorkDetails = workDetails.filter(Boolean);

          if (sessionUserRoleName !== 'Super-admin' && sessionUserRoleName !== 'Admin' && sessionUserRoleName !== 'Manager' && filteredWorkDetails.length === 0) {
            return null;
          }

          return {
            work_id: work.work_id,
            enquiry_id: work.enquiry_id,
            customer_name: `${customer.first_name} ${customer.last_name}`,
            work_status: work.Status.status,
            work_details: filteredWorkDetails,
            enquiry_date: enquiry.created_at,
            created_by: work.created_by,
            created_at: work.created_at,
            updated_by: work.updated_by,
            updated_at: work.updated_at,
            session_user_role: sessionUserRoleName,
          };
        })
      );

      res.status(200).json(result.filter(Boolean));
    } catch (error) {
      console.error('Error fetching works:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}
