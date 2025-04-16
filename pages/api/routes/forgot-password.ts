import { NextApiRequest, NextApiResponse } from 'next';
import { sendOtpEmail } from '../routes/email-service';
import User from '../models/User'; // Adjust path as necessary
import { storeOtp } from '../utils/StoreOtp'; // Import your OTP storage function

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { email } = req.body;

    try {
      const user = await User.findOne({ where: { email } });

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      // Generate OTP
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      storeOtp(email, otp); // Store OTP and log it
      console.log(`Generated OTP for ${email}: ${otp}`); // Log generated OTP

      // Send OTP via email
      await sendOtpEmail(email, otp);
      console.log(`Sent OTP ${otp} to email ${email}`); // Log sent OTP

      res.json({ message: 'OTP sent to your email' });
    } catch (error) {
      console.error('Error sending OTP:', error);
      res.status(500).json({ message: 'Error sending OTP' });
    }
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}
