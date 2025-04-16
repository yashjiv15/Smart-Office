// /app/Userlogin/page.tsx

"use client";
import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { loginUser } from '../../apiService';
import Header from '../../components/Header';
import SideBar from '../../components/SideBar';
import Link from 'next/link';

interface SignupForm {
  email: string;
  mobile: string;
  password: string;
}

interface SigninForm {
  email: string;
  password: string;
}

interface Errors {
  email?: string;
  mobile?: string;
  password?: string;
}

const RegisterLogin: React.FC = () => {
  const [signupForm, setSignupForm] = useState<SignupForm>({
    email: '',
    mobile: '+91',
    password: ''
  });

  const [signinForm, setSigninForm] = useState<SigninForm>({
    email: '',
    password: ''
  });

  const [errors, setErrors] = useState<Errors>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showSigninPassword, setShowSigninPassword] = useState(false);
  const [loginMessage, setLoginMessage] = useState<string | null>(null);

  useEffect(() => {
    const signupBtn = document.getElementById('signup-btn');
    const signinBtn = document.getElementById('signin-btn');
    const mainContainer = document.querySelector('.container');

    const toggleForm = () => {
      if (mainContainer) {
        mainContainer.classList.toggle('change');
      }
    };

    signupBtn?.addEventListener('click', toggleForm);
    signinBtn?.addEventListener('click', toggleForm);

    return () => {
      signupBtn?.removeEventListener('click', toggleForm);
      signinBtn?.removeEventListener('click', toggleForm);
    };
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    formType: 'signup' | 'signin'
  ) => {
    const { name, value } = e.target;

    if (formType === 'signup') {
      setSignupForm({
        ...signupForm,
        [name]: name === 'mobile' ? '+91' + value.replace('+91', '') : value
      });
    } else {
      setSigninForm({
        ...signinForm,
        [name]: value
      });
    }
  };

  const validateSignupForm = () => {
    const { email, mobile, password } = signupForm;
    const newErrors: Errors = {};

    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email address is invalid';
    }

    if (!mobile || mobile === '+91') {
      newErrors.mobile = 'Mobile number is required';
    } else if (!/^\+91\d{10}$/.test(mobile)) {
      newErrors.mobile = 'Mobile number is invalid';
    }

    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    } else if (!/[a-z]/.test(password)) {
      newErrors.password = 'Password must contain at least one lowercase letter';
    } else if (!/[A-Z]/.test(password)) {
      newErrors.password = 'Password must contain at least one uppercase letter';
    } else if (!/[0-9]/.test(password)) {
      newErrors.password = 'Password must contain at least one digit';
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const validateSigninForm = () => {
    const { email, password } = signinForm;
    const newErrors: Errors = {};

    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email address is invalid';
    }

    if (!password) {
      newErrors.password = 'Password is required';
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSigninSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (validateSigninForm()) {
      try {
        const { email, password } = signinForm;

        // Trim email and password
        const trimmedEmail = email.trim();
        const trimmedPassword = password.trim();

        const response = await loginUser({ email: trimmedEmail, password: trimmedPassword });
        console.log('Signin response:', response);
        setLoginMessage('Login successful!');
        // Handle successful signin (e.g., store token, redirect to dashboard, etc.)
        window.location.href = '/ViewCustomer'; // Example redirect after login
      } catch (error: any) {
        console.error('Signin error:', error);
        if (error?.response?.data) {
          setLoginMessage('Login failed. Incorrect email or password.');
        } else {
          setLoginMessage('Invalid credentials.');
        }
      }
    }
  };

  return (
    <div className="overflow-hidden">  
      <Head>
        <title>Signin form</title>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.2/css/all.min.css"
          rel="stylesheet"
        />
      </Head>
      <div className="flex flex-col min-h-screen bg-white-100">
            <Header /> {/* Assuming this component renders your header */}
            <div className="flex-grow flex justify-center items-center">
                <div className="relative py-3 sm:mx-auto sm:max-w-xl">
                    <div className="absolute inset-0 -skew-y-6 transform bg-gradient-to-r bg-blue-600 shadow-lg sm:-rotate-6 sm:skew-y-0 sm:rounded-3xl"></div>
                    <div className="relative bg-white px-4 py-6 shadow-lg sm:rounded-3xl sm:p-20">
                        <div className="mx-auto max-w-md">
              <div>
                <h1 className="text-4xl font-merriweather">Login</h1>
              </div>
              <form onSubmit={handleSigninSubmit} className="divide-y divide-gray-200">
                <div className="space-y-4 py-8 text-base leading-6 text-gray-700 sm:text-lg sm:leading-7">
                  <div className="relative">
                    <input
                      autoComplete="on"
                      id="email"
                      name="email"
                      type="text"
                      value={signinForm.email}
                      onChange={(e) => handleInputChange(e, 'signin')}

                      className={`focus:border-blue-600 peer h-10 w-full border-b-2 border-gray-300 text-gray-900 placeholder-transparent focus:outline-none font-roboto
                     ` }
                     placeholder="Email address"
                    />
                    <label
                      htmlFor="email"
                      className="font-roboto peer-placeholder-shown:text-gray-440 absolute -top-3.5 left-0 text-sm text-gray-600 transition-all peer-placeholder-shown:top-2 peer-placeholder-shown:text-base peer-focus:-top-3.5 peer-focus:text-sm peer-focus:text-gray-600"
                    >
                      Email Address
                    </label>
                    {errors.email && (
                      <p className="text-red-500 text-xs mt-1 text-center">{errors.email}</p>
                    )}
                  </div>
                  <div className="relative">
                    <input
                      autoComplete="on"
                      id="password"
                      name="password"
                      type="password"
                      value={signinForm.password}
                      onChange={(e) => handleInputChange(e, 'signin')}
                      className={`focus:border-blue-600 peer h-10 w-full border-b-2 border-gray-300 text-gray-900 placeholder-transparent focus:outline-none font-roboto`}                      placeholder="Password"
                    />
                    <label
                      htmlFor="password"
                      className=" font-roboto peer-placeholder-shown:text-gray-440 absolute -top-3.5 left-0 text-sm text-gray-600 transition-all peer-placeholder-shown:top-2 peer-placeholder-shown:text-base peer-focus:-top-3.5 peer-focus:text-sm peer-focus:text-gray-600"
                    >
                      Password
                    </label>
                    {errors.password && (
                      <p className="text-red-500 text-xs mt-1 font-roboto text-center">{errors.password}</p>
                    )}
                  </div>
                  <div className="relative">
                  <button type="submit" className="hover:shadow-form rounded-md bg-blue-600 py-3 px-5 mt-10 text-center text-base font-semibold text-white outline-none">
                  <i className="fas fa-check mr-2"></i>  
                      Submit
                    </button>
                  </div>
                  {loginMessage && (
                    <p className={`mt-4 font-roboto ${loginMessage.includes('successful') ? 'text-green-500' : 'text-red-500'}`}>
                      {loginMessage}
                    </p>
                  )}
                </div>
              </form>
            </div>

            <div className="flex w-full justify-center mt-4">
            <Link href="/ForgotPassword">
            <button className="font-roboto flex items-center rounded-lg border border-gray-300 bg-white px-6 py-2 text-sm font-medium text-gray-800 shadow-md hover:bg-gray-200 hover:outline-blue-600 focus:ring-2 focus:ring-blue-600 focus:ring-offset-2">
            <span className='flex items-center'>Forgot Password &nbsp;<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
  <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 5.25h.008v.008H12v-.008Z" />
</svg>
</span>
            </button>
</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
};

export default RegisterLogin;