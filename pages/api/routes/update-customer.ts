// src/pages/api/customers/edit.ts

import { NextApiRequest, NextApiResponse } from 'next';
import { connectDB } from '../config/db';
import Customer from '../models/Customer';

connectDB();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

  if (req.method === 'PUT') {
    const sessionEmail = req.headers['session-email'];

    if (!sessionEmail) {
          return res.status(401).json({ message: 'Session email is missing' });
        }
    const {
      customer_id,
      first_name,
      last_name,
      spoc_name,
      spoc_mobile,
      company_name,
      company_registration_number,
      company_mobile,
      email,
      mobile,
      company_gst,
      pan,
      adhaar,
      updated_by,
    } = req.body;

    try {
      const customer = await Customer.findByPk(customer_id);
      if (!customer) {
        return res.status(404).json({ message: 'Customer not found' });
      }

      await customer.update({
        first_name,
        last_name,
        spoc_name,
        spoc_mobile,
        company_name,
        company_registration_number,
        company_mobile,
        email,
        mobile,
        company_gst,
        pan,
        adhaar,
        updated_by:sessionEmail,
      });

      return res.status(200).json({ message: 'Customer updated successfully', customer });
    } catch (error) {
      console.error('Error updating customer:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  } else {
    res.status(405).json({ message: `Method ${req.method} not allowed` });
  }
}