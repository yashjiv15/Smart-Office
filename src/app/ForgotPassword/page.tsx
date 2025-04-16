"use client";
import React, { useState, useRef } from 'react';
import Head from 'next/head';
import Header from '../../components/Header';
import { forgotPassword, verifyOtp, resetPassword } from '../../apiService';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [verificationCode, setVerificationCode] = useState(['', '', '', '', '', '']);
    const [otpSent, setOtpSent] = useState(false);
    const [otpVerified, setOtpVerified] = useState(false);
    const [newPassword, setNewPassword] = useState('');
    const [loading, setLoading] = useState(false); // State for loading indicator
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const inputRefs = useRef<(HTMLInputElement | null)[]>(Array(6).fill(null));

    const handleInputChangeByIndex = (index: number, value: string) => {
        value = value.slice(-1); // Ensure only single character input

        const updatedVerificationCode = [...verificationCode];
        updatedVerificationCode[index] = value;
        setVerificationCode(updatedVerificationCode);

        if (value !== '' && index < 5 && inputRefs.current[index + 1]) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Backspace' && index > 0 && verificationCode[index] === '') {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handleSendOtp = async () => {
        setLoading(true); // Start loading indicator
        try {
            await forgotPassword({ email });
            setOtpSent(true);
            setSuccessMessage('OTP sent successfully. Check your email.');
            setErrorMessage(null);
        } catch (error) {
            console.error('Error sending OTP:', error);
            setErrorMessage('Failed to send OTP. Please check your email address.');
            setSuccessMessage(null);
        } finally {
            setLoading(false); // Stop loading indicator regardless of success or failure
        }
    };

    const handleVerifyOtp = async () => {
        try {
            const otp = verificationCode.join('');
            await verifyOtp({ email, otp });
            setOtpVerified(true);
            setSuccessMessage('OTP verified successfully.');
            setErrorMessage(null);
        } catch (error) {
            console.error('Error verifying OTP:', error);
            setErrorMessage('Failed to verify OTP. Please check the code entered.');
            setSuccessMessage(null);
        }
    };

    const handleResetPassword = async () => {
        try {
            await resetPassword({ email, newPassword });
            setSuccessMessage('Password reset successfully.');
            setErrorMessage(null);
           // Delay redirect after 3 seconds
        setTimeout(() => {
            window.location.href = '/UserLogin'; // Redirect after 3 seconds
        }, 2000); // 3000 milliseconds = 3 seconds


        } catch (error) {
            console.error('Error resetting password:', error);
            setErrorMessage('Failed to reset password. Please try again.');
            setSuccessMessage(null);
        }
    };

    const handleBack = () => {
        if (otpVerified) {
            // Navigate back to User Login
            setOtpVerified(false);
            window.location.href = '/UserLogin'; // Example redirect after login
        } else if (otpSent) {
            // Navigate back to User Login
            setOtpSent(false);
        } else {
            setOtpSent(false);
            window.location.href = '/UserLogin'; // Example redirect after login
        }
    };

    return (
        <div className="overflow-hidden">
            <Head>
                <title>Forgot Password</title>
                <meta charSet="utf-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link
                    href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.2/css/all.min.css"
                    rel="stylesheet"
                />
            </Head>
            <div className="flex flex-col min-h-screen bg-white-100">
                <Header /> {/* Ensure this component renders your header */}
                <div className="flex-grow flex justify-center items-center">
                    <div className="relative py-3 sm:mx-auto sm:max-w-sm">
                        <div className="absolute inset-0 -skew-y-6 transform bg-gradient-to-r bg-blue-600 shadow-lg sm:-rotate-6 sm:skew-y-0 sm:rounded-3xl"></div>
                        <div className="relative bg-white px-4 py-10 shadow-lg sm:rounded-3xl sm:p-20">
                            <div className="mx-auto max-w-md">
                            <div className="flex items-center justify-start mb-4">
                                    <button onClick={handleBack} className="text-black-600 hover:text-blue-600 focus:outline-none">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 15.75 3 12m0 0 3.75-3.75M3 12h18" />
                                        </svg>
                                    </button>
                                </div>
                                <div>
                                    {otpVerified ? (
                                        <h1 className="text-4xl font-merriweather">Reset Password</h1>
                                    ) : otpSent ? (
                                        <h1 className="text-4xl font-merriweather">Verify OTP</h1>
                                    ) : (
                                        <h1 className="text-4xl font-merriweather">Forgot Password</h1>
                                    )}
                                </div>
                                {!otpSent && !otpVerified && (
                                    <form className="divide-y divide-gray-200">
                                        <div className="space-y-4 py-8 text-base leading-6 text-gray-700 sm:text-lg sm:leading-7">
                                            <div className="relative">
                                                <input
                                                    autoComplete="on"
                                                    id="email"
                                                    name="email"
                                                    type="text"
                                                    value={email}
                                                    onChange={(e) => setEmail(e.target.value)}
                                                    className="focus:border-blue-600 peer h-10 w-full border-b-2 border-gray-300 text-gray-900 placeholder-transparent focus:outline-none font-roboto"
                                                    placeholder="Email address"
                                                />
                                                 <label
                                                    htmlFor="email"
                                                    className="font-roboto peer-placeholder-shown:text-gray-440 absolute -top-3.5 left-0 text-sm text-gray-600 transition-all peer-placeholder-shown:top-2 peer-placeholder-shown:text-base peer-focus:-top-3.5 peer-focus:text-sm peer-focus:text-gray-600"
                                                >
                                                    Enter Email Address
                                                </label>
                                                {errorMessage && <p className="text-red-500 text-xs mt-1 text-center">{errorMessage}</p>}
                                            </div>
                                            <div className="relative">
                                            <button type="button" onClick={handleSendOtp} className="rounded-md bg-blue-600 px-2 py-1 text-white font-roboto">
                                                    {loading ? 'Sending...' : 'Send OTP'}
                                                </button>
                                            </div>
                                            {successMessage && (
                                                <p className="mt-4 font-roboto text-green-500 text-center">{successMessage}</p>
                                            )}
                                        </div>
                                    </form>
                                )}
                                {otpSent && !otpVerified && (
                                    <form className="divide-y divide-gray-200">
                                        <div className="space-y-4 py-8 text-base leading-6 text-gray-700 sm:text-lg sm:leading-7">
                                        <div className="relative flex justify-center items-center space-x-2">
                                            {verificationCode.map((digit, index) => (
                                                <input
                                                    key={index}
                                                    type="text"
                                                    id={`verification-code-${index}`}
                                                    aria-label={`Digit ${index + 1} of OTP`}
                                                    className="mt-2 focus:border-blue-600 peer h-10 w-10 text-center border-b-2 border-gray-300 text-gray-900 placeholder-transparent focus:outline-none font-roboto"
                                                    value={digit}
                                                    onChange={(e) => handleInputChangeByIndex(index, e.target.value)}
                                                    onKeyDown={(e) => handleKeyDown(index, e)}
                                                    ref={(input) => {
                                                        if (input) {
                                                            inputRefs.current[index] = input;
                                                        }
                                                    }}
                                                />
                                            ))}
                                             <label
                      className=" font-roboto peer-placeholder-shown:text-gray-440 absolute -top-3.5 left-0 text-sm text-gray-600 transition-all peer-placeholder-shown:top-2 peer-placeholder-shown:text-base peer-focus:-top-3.5 peer-focus:text-sm peer-focus:text-gray-600"
                      style={{ zIndex: 10 }} // Ensure label is above input
        >
            Enter 6 Digit OTP
        </label>
                                            </div>
                                            {errorMessage && <p className="text-red-500 text-xs mt-1 text-center">{errorMessage}</p>}
                                            <div className="relative flex justify-center items-center">
                                                <button type="button" onClick={handleVerifyOtp} className="rounded-md bg-blue-600 px-2 py-1 text-white font-roboto">
                                                    Verify OTP
                                                </button>
                                            </div>
                                            {successMessage && (
                                                <p className="mt-4 font-roboto text-green-500 text-center">{successMessage}</p>
                                            )}
                                        </div>
                                    </form>
                                )}
                                {otpVerified && (
                                    <form className="divide-y divide-gray-200">
                                        <div className="space-y-4 py-8 text-base leading-6 text-gray-700 sm:text-lg sm:leading-7">
                                            <div className="relative">
                                                <input
                                                    autoComplete="on"
                                                    id="newPassword"
                                                    name="newPassword"
                                                    type="password"
                                                    value={newPassword}
                                                    onChange={(e) => setNewPassword(e.target.value)}
                                                    className="focus:border-blue-600 peer h-10 w-full border-b-2 border-gray-300 text-gray-900 placeholder-transparent focus:outline-none font-roboto"
                                                    placeholder="New Password"
                                                />
                                                {errorMessage && <p className="text-red-500 text-xs mt-1">{errorMessage}</p>}
                                            </div>
                                            <div className="relative">
                                                <button type="button" onClick={handleResetPassword} className="rounded-md bg-blue-600 px-2 py-1 text-white font-roboto">
                                                    Reset Password
                                                </button>
                                            </div>
                                            {successMessage && (
                                                <p className="mt-4 font-roboto text-green-500">{successMessage}</p>
                                            )}
                                        </div>
                                    </form>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;
