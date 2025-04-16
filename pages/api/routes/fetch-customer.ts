// src/pages/api/routes/fetch-customer.ts

import { NextApiRequest, NextApiResponse } from 'next';
import { connectDB } from '../config/db';
import Customer from '../models/Customer';
import { Op } from 'sequelize';

connectDB();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const { email_mobile } = req.query;

    try {
      const customer = await Customer.findOne({
        where: {
          [Op.or]: [
            { email: email_mobile },
            { mobile: email_mobile }
          ],
          is_deleted: false,
        },
      });

      if (customer) {
        res.status(200).json(customer);
      } else {
        res.status(404).json({ message: 'Customer does not exist' });
      }
    } catch (error) {
      console.error('Error fetching customer:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}
