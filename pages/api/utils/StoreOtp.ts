interface OTPRecord {
  otp: string;
  timestamp: number;
}

const otpStore: Record<string, OTPRecord> = {};

export const storeOtp = (email: string, otp: string): void => {
  if (otpStore[email]) {
    // Update OTP if already exists for this email
    console.log(`Updated OTP for ${email}: ${otp}`);
  } else {
    console.log(`Stored OTP for ${email}: ${otp}`);
  }

  otpStore[email] = {
    otp,
    timestamp: Date.now(),
  };
};

export const getOtp = (email: string): string | undefined => {
  const storedData = otpStore[email];
  
  if (storedData) {
    console.log(`Retrieved OTP for ${email}: ${storedData.otp}`);
    return storedData.otp;
  }

  return undefined;
};

export const deleteOtp = (email: string): void => {
  delete otpStore[email];
  console.log(`Deleted OTP for ${email}`);
};
