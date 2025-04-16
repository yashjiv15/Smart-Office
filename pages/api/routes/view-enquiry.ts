import { NextApiRequest, NextApiResponse } from 'next';
import { connectDB } from '../config/db';
import defineAssociations from '../models/associations';
import Customer from '../models/Customer';
import Enquiry from '../models/Enquiry';
import WorkMaster from '../models/WorkMaster';
import User from '../models/User';
import Status from '../models/Status';

connectDB();
defineAssociations();

interface WorkMasterData {
  work_master: string;
  work_document: any;
  work_cost: any;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      // Fetch enquiries with associated customer data and status data
      const enquiries = await Enquiry.findAll({
        where: { is_deleted: false },
        include: [
          {
            model: Customer,
            attributes: ['first_name', 'last_name'],
          },
          {
            model: Status,
            attributes: ['status'], // Include status description
          },
        ],
      });

      // Collect unique email addresses from created_by and updated_by fields
      const emails: string[] = [];
      enquiries.forEach(enquiry => {
        if (enquiry.created_by && !emails.includes(enquiry.created_by)) {
          emails.push(enquiry.created_by);
        }
        if (enquiry.updated_by && !emails.includes(enquiry.updated_by)) {
          emails.push(enquiry.updated_by);
        }
      });

      // Find all users with these emails
      const users = await User.findAll({
        where: {
          email: emails,
        },
        attributes: ['email', 'first_name', 'last_name'],
        raw: true,
      });

      // Create a map for quick lookup of user's full name by email
      const userMap: { [key: string]: string } = {};
      users.forEach(user => {
        userMap[user.email] = `${user.first_name} ${user.last_name}`;
      });

      // Process each enquiry
      const response = await Promise.all(enquiries.map(async (enquiry) => {
        // Combine first_name and last_name into customer_name
        const customerName = `${enquiry.Customer?.first_name || ''} ${enquiry.Customer?.last_name || ''}`.trim();

        // Safely parse work_enquiry field
        let workMasterIds: number[] = [];
        if (typeof enquiry.work_enquiry === 'string') {
          try {
            workMasterIds = JSON.parse(enquiry.work_enquiry) as number[];
          } catch (parseError) {
            console.error('Error parsing work_enquiry:', parseError);
          }
        } else if (Array.isArray(enquiry.work_enquiry)) {
          workMasterIds = enquiry.work_enquiry as number[];
        }

        // Define the type for workMasterData
        const workMasterData: WorkMasterData[] = [];

        if (workMasterIds.length > 0) {
          try {
            // Fetch work master data based on IDs
            const workMasterDataPromises = workMasterIds.map(async (id: number) => {
              const workMaster = await WorkMaster.findByPk(id);
              if (workMaster) {
                return {
                  work_master: workMaster.work_master,
                  work_document: workMaster.work_document,
                  work_cost: workMaster.work_cost,
                };
              }
              return null; // Return null if not found
            });

            // Wait for all promises to resolve and filter out null values
            const resolvedData = await Promise.all(workMasterDataPromises);
            resolvedData.forEach((data) => {
              if (data) workMasterData.push(data);
            });

          } catch (parseError) {
            console.error('Error processing work_master data:', parseError);
            // Handle errors during data processing
          }
        }

        return {
          enquiry_id: enquiry.enquiry_id,
          customer_name: customerName,
          work_enquiry: workMasterData, // Return filtered work master data
          enquiry_status: enquiry.Status?.status, // Return status description
          created_by: userMap[enquiry.created_by as string] || enquiry.created_by,
          created_at: enquiry.created_at.toISOString(),
          updated_by: userMap[enquiry.updated_by as string] || enquiry.updated_by,
          updated_at: enquiry.updated_at.toISOString(),
          is_deleted: enquiry.is_deleted,
        };
      }));

      res.status(200).json(response);
    } catch (error) {
      console.error('Error fetching enquiries:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
