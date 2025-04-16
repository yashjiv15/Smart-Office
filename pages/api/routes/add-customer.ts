import { NextApiRequest, NextApiResponse } from 'next';
import { connectDB } from '../config/db';
import Customer from '../models/Customer';
import { ValidationErrorItem, Transaction, Op } from 'sequelize';

connectDB();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const transaction: Transaction = await Customer.sequelize!.transaction(); // Start a transaction
    const sessionEmail = req.headers['session-email'];

    if (!sessionEmail) {
      return res.status(401).json({ message: 'Session email is missing' });
    }

    try {
      const {
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
        created_by,
      } = req.body;

      // Treat empty strings as undefined to avoid not null violations
      const cleanedCompanyName = company_name?.trim() === '' ? undefined : company_name;
      const cleanedCompanyRegistrationNumber = company_registration_number?.trim() === '' ? undefined : company_registration_number;
      const cleanedCompanyMobile = company_mobile?.trim() === '' ? undefined : company_mobile;
      const cleanedCompanyGST = company_gst?.trim() === '' ? undefined : company_gst;

      // Construct where clause conditionally
      const whereConditions: { [key: string]: any }[] = [
        { pan },
        { adhaar },
        { email },
        { mobile },
      ];

      // Preliminary checks for unique constraints
      const existingCustomer = await Customer.findOne({
        where: {
          [Op.or]: whereConditions,
        },
      });

      if (existingCustomer) {
        const errorMessages: { [key: string]: string } = {};
        if (existingCustomer.getDataValue('company_registration_number') === cleanedCompanyRegistrationNumber) {
          errorMessages.company_registration_number = 'Company registration number already exists';
        }
        if (existingCustomer.getDataValue('company_mobile') === cleanedCompanyMobile) {
          errorMessages.company_mobile = 'Company mobile number already exists';
        }
        if (existingCustomer.getDataValue('company_gst') === cleanedCompanyGST) {
          errorMessages.company_gst = 'Company GST number already exists';
        }
        if (existingCustomer.getDataValue('pan') === pan) {
          errorMessages.pan = 'PAN number already exists';
        }
        if (existingCustomer.getDataValue('adhaar') === adhaar) {
          errorMessages.adhaar = 'Aadhaar number already exists';
        }
        if (existingCustomer.getDataValue('email') === email) {
          errorMessages.email = 'Email already exists';
        }
        if (existingCustomer.getDataValue('mobile') === mobile) {
          errorMessages.mobile = 'Mobile number already exists';
        }
        await transaction.rollback(); // Rollback transaction on error
        res.status(400).json({ message: 'Customer details already exist', errors: errorMessages });
        return;
      }

      // Create a new customer record with cleaned values
      const newCustomer = await Customer.create(
        {
          first_name,
          last_name,
          spoc_name,
          spoc_mobile,
          company_name: cleanedCompanyName,
          company_registration_number: cleanedCompanyRegistrationNumber,
          company_mobile: cleanedCompanyMobile,
          email,
          mobile,
          company_gst: cleanedCompanyGST,
          pan,
          adhaar,
          created_by: sessionEmail,
        },
        { transaction }
      );

      await transaction.commit(); // Commit transaction on success
      res.status(200).json({ message: 'Customer created successfully', customer: newCustomer });
    } catch (error) {
      await transaction.rollback(); // Rollback transaction on error
      if (error.name === 'SequelizeValidationError') {
        const errorMessages: { [key: string]: string } = {};
        (error.errors as ValidationErrorItem[]).forEach(err => {
          if (err.path) {
            errorMessages[err.path] = `${err.message}`;
          }
        });
        res.status(400).json({ message: 'Validation error', errors: errorMessages });
      } else {
        console.error('Error during customer creation:', error);
        res.status(500).json({ message: 'Internal server error' });
      }
    }
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}
