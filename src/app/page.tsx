"use client";
import React from 'react';
import logo from '../public/assets/images/r.png';
import technologyImage from '../public/assets/images/technology.png'; // Import your technology image
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faClock, faHeadset } from '@fortawesome/free-solid-svg-icons'; // Import the icons you want to use from Font Awesome
import Link from 'next/link';

const Page = () => {
  const features = [
    {
      icon: faUser,
      title: 'Easy to Use',
      description: 'Our system is designed to be user-friendly and intuitive.',
    },
    {
      icon: faClock,
      title: 'Efficient',
      description: 'Improve your office efficiency with our smart solutions.',
    },
    {
      icon: faHeadset,
      title: 'Support',
      description: 'We provide 24/7 support to ensure your satisfaction.',
    },
  ];

  return (
    <>
      {/* Navbar Section */}
      <nav className="dark:bg-gray-900 fixed w-full z-20 top-0 start-0 bg-[#F8F9FA] border-b border-gray-200 dark:border-gray-600">
        <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
          <a href="#home" className="flex items-center space-x-3 rtl:space-x-reverse">
            <img src={logo.src} className="h-12" alt="Flowbite Logo" />
          </a>
          <div className="flex md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse">
            <Link href="/UserLogin">
            <button className="relative inline-flex items-center justify-center p-0.5 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-cyan-600 to-blue-600 group-hover:from-cyan-500 group-hover:to-blue-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-cyan-200 dark:focus:ring-cyan-800">
              <span className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0">Login</span>
            </button>
            </Link>
            <button
              data-collapse-toggle="navbar-sticky"
              type="button"
              className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
              aria-controls="navbar-sticky"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 14">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 1h15M1 7h15M1 13h15" />
              </svg>
            </button>
          </div>
          <div className="items-center justify-between hidden w-full md:flex md:w-auto md:order-1" id="navbar-sticky">
            <ul className="flex flex-col p-4 md:p-0 mt-4 font-medium border border-gray-100 rounded-lg bg-[#F8F9FA] md:space-x-10 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 md:bg-[#F8F9FA] dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
              <li>
                <a href="#home" className="block py-2 px-3 text-white bg-blue-700 rounded md:bg-transparent md:text-blue-700 md:p-0 md:dark:text-blue-500" aria-current="page">Home</a>
              </li>
              <li>
                <a href="#why-choose-us" className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 md:dark:hover:text-blue-500 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700">Why Choose Us</a>
              </li>
              <li>
                <a href="#contact" className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 md:dark:hover:text-blue-500 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700">Contact</a>
              </li>
            </ul>
          </div>
        </div>
      </nav>

   {/* Home Section */}
   <section id="home" className="relative h-[600px] mt-20 flex items-center justify-center text-black bg-gray-100 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-700 to-cyan-500 transform skew-y-6 origin-top-left"></div>
        </div>
        <div className="relative z-10 max-w-screen-xl mx-auto flex items-center">
          {/* Image and Content Container */}
          <div className="flex flex-col md:flex-row items-center justify-center md:justify-between w-full md:space-x-16">
            {/* Image on the left with 3D effect */}
            <div className="flex-shrink-0 md:order-1 animate-fade-left">
                <img src={technologyImage.src} className="h-[500px] w-[500px] rounded-md object-cover shadow-lg" alt="Technology Image" />
            </div>
            {/* Content on the right with animation */}
            <div className="md:order-2 text-center md:text-left mt-10 md:mt-0 animate-fade-right">
              <h1 className="text-5xl mb-16 text-white">Welcome to Int Office</h1>
              <p className="text-lg mb-2">
                Experience the Future of Work with Our Smart Office Solutions.
              </p>
              <p className="text-lg">
                Explore How Our Smart Office Enhances Productivity and Comfort.
              </p>
            </div>
          </div>
        </div>
      </section>

     {/* Why Choose Us Section */}
     <section id="why-choose-us" className="h-[500px] flex flex-col items-center bg-gray-100 text-gray-900">
        <h2 className="text-5xl mb-10 mt-16">Why Choose Us</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-[900px]">
          {features.map((feature, index) => (
            <div key={index} className="p-6 bg-white rounded-lg shadow-lg flex flex-col items-center text-center transform transition-all duration-300 hover:scale-105 hover:shadow-2xl">
            <FontAwesomeIcon icon={feature.icon} className="text-2xl mb-4 text-blue-600" style={{ width: '100px', height: '100px' }} />
            <h3 className="text-2xl mb-4">{feature.title}</h3>
            <p>{feature.description}</p>
          </div>
          
          ))}
        </div>
      </section>

     

      {/* Footer Section */}
      <footer className="bg-[#1F2937] text-white py-6">
        <div className="max-w-screen-xl mx-auto px-4">
          <div className="flex justify-between items-center">
            <span>&copy; 2024 Int Office. All rights reserved.</span>
            {/* <ul className="flex space-x-4">
              <li><a href="#home" className="hover:text-blue-400">Home</a></li>
              <li><a href="#why-choose-us" className="hover:text-blue-400">Why Choose Us</a></li>
              <li><a href="#contact" className="hover:text-blue-400">Contact</a></li>
            </ul> */}
          </div>
        </div>
      </footer>
    </>
  );
};

export default Page;