import { NextApiRequest, NextApiResponse } from 'next';
import { getOtp } from '../utils/StoreOtp';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { email, otp } = req.body;
    console.log(`Received email: ${email}, OTP: ${otp}`); // Log received email and OTP

    try {
      const storedOtp = getOtp(email);

      if (!storedOtp) {
        return res.status(400).json({ message: 'OTP not found for the provided email' });
      }

      if (otp === storedOtp) {
        res.json({ message: 'OTP verified successfully' });
      } else {
        console.log('Expected OTP:', storedOtp); // Log expected OTP for debugging
        console.log('Received OTP:', otp);       // Log received OTP for debugging
        res.status(400).json({ message: 'Invalid OTP' });
      }
    } catch (error) {
      console.error('Error verifying OTP:', error);
      res.status(500).json({ message: 'Error verifying OTP' });
    }
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}
