import { NextApiRequest, NextApiResponse } from 'next';
import { connectDB } from '../config/db';
import Customer from '../models/Customer';

connectDB();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'DELETE') {
    try {
      const { customer_id } = req.body;

      // Perform the deletion operation
      const deletedCustomer = await Customer.findByPk(Number(customer_id));

      if (!deletedCustomer) {
        return res.status(404).json({ message: 'Customer not found' });
      }

      // Soft delete: Update is_deleted flag
      await deletedCustomer.update({ is_deleted: true });

      return res.status(200).json({ message: 'Customer deleted successfully' });
    } catch (error) {
      console.error('Error deleting customer:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  } else {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }
}
