// src/app/emailService.ts
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export const sendOtpEmail = async (email: string, otp: string) => {
  try {
    const info = await transporter.sendMail({
      from: `"Smart Office" <${process.env.SMTP_USER}>`, // sender address
      to: email, // list of receivers
      subject: 'Your OTP Code', // Subject line
text: `Your OTP code is ${otp}.
Expiration validity of this code is within the next 30 minutes.`, // plain text body
    });

    console.log('Message sent: %s', info.messageId);
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};
