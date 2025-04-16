"use client";

import React, { useState } from "react";
import logo from '../public/assets/images/r.png';
import { useRouter } from 'next/navigation';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { logoutUser } from '../apiService';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGear, faUser } from '@fortawesome/free-solid-svg-icons';
import { faRightFromBracket } from '@fortawesome/free-solid-svg-icons';
import { faIdCardClip } from '@fortawesome/free-solid-svg-icons';


const Header = () => {
  const router = useRouter();
  const pathname = usePathname();

  const isUserLogin = pathname === '/UserLogin';

  const [selectedIcon, setSelectedIcon] = useState("");

  const icons = [
    { id: "bell", className: "fas fa-bell" },
  ];

  const baseClasses =
    "text-[#1F2937] text-[30px] p-[15px] rounded-full cursor-pointer transition ease-in-out duration-300";
  const hoverClasses =
    "hover:bg-[#F8F9FA] hover:text-blue-600 hover:text-[#7a7a7a]";
  const activeClasses =
    "text-blue-600 bg-[#F8F9FA] shadow-[6px_6px_20px_#9b9a9a,-15px_-15px_50px_#f5f5f5]";

  const getBreadcrumbAndHeading = () => {
    switch (pathname) {
      case '/ViewCustomer':
        return { breadcrumb: 'Customer', heading: 'All Customers' };
      case '/AddCustomer':
        return { breadcrumb: 'Customer', heading: 'Add New Customer' };
        case '/AddUser':
        return { breadcrumb: 'Employee', heading: 'Add New Employee' };
        case '/UpdateUser':
          return { breadcrumb: 'Employee', heading: 'Update Employee' };
          case '/RoleMaster':
            return { breadcrumb: 'Role', heading: 'Role Master' };
        case '/ViewUser':
        return { breadcrumb: 'Employee', heading: 'All Employees' };
        case '/WorkMaster':
          return { breadcrumb: 'Work', heading: 'All Work Masters' };
          case '/Work':
            return { breadcrumb: 'Work', heading: 'Work / Task' };
        case '/UpdateCustomer':
          return { breadcrumb: 'Customer', heading: 'Update Customer' };
        case '/ViewDocument':
          return { breadcrumb: 'Document', heading: 'All Documents' };
        case '/AddEnquiry':
            return { breadcrumb: 'Enquiry', heading: 'Add New Enquiry' };
        case '/ViewEnquiry':
            return { breadcrumb: 'Enquiry', heading: 'All Enquiries' };
        case '/ViewPermission':
            return { breadcrumb: 'Permission', heading: 'All Permissions' };
        default:
        return { breadcrumb: 'Dashboard', heading: 'Dashboard' };
    }
  };

  const { breadcrumb, heading } = getBreadcrumbAndHeading();
  const handleLogout = async () => {
    try {
      await logoutUser();
      router.push('/UserLogin');
    } catch (error) {
      console.error('Logout failed', error);
    }
  };
  return (
    <>
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.1/css/all.min.css"
      />
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css"></link>
      <div className="bg-[#F8F9FA]">
        <nav
          navbar-main="true"
          className="relative flex flex-wrap items-center justify-between w-full px-0 py-2 mx-6 transition-all shadow-none duration-250 ease-soft-in rounded-2xl lg:flex-nowrap lg:justify-start"
          navbar-scroll="true"
        >
          <div className="flex items-center justify-between w-full px-4 py-1 mx-auto flex-wrap-inherit">
            <img src={logo.src} className="mt-0 top-0 h-16 ml-2" alt="main_logo" />
            {!isUserLogin && (
              <nav className="ml-16">
                <ol className="flex flex-wrap pt-1 mr-12 bg-transparent rounded-lg sm:mr-16">
                  <Link href="/Dashboard">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
                    <path d="M11.47 3.841a.75.75 0 0 1 1.06 0l8.69 8.69a.75.75 0 1 0 1.06-1.061l-8.689-8.69a2.25 2.25 0 0 0-3.182 0l-8.69 8.69a.75.75 0 1 0 1.061 1.06l8.69-8.689Z" />
                    <path d="m12 5.432 8.159 8.159c.03.03.06.058.091.086v6.198c0 1.035-.84 1.875-1.875 1.875H15a.75.75 0 0 1-.75-.75v-4.5a.75.75 0 0 0-.75-.75h-3a.75.75 0 0 0-.75.75V21a.75.75 0 0 1-.75.75H5.625a1.875 1.875 0 0 1-1.875-1.875v-6.198a2.29 2.29 0 0 0 .091-.086L12 5.432Z" />
                  </svg>
                  </Link>
                  &nbsp;
                  <li
                    className="text-md pl-2 capitalize leading-normal text-slate-700 before:float-left before:pr-2 before:text-gray-600 before:content-['/']"
                    aria-current="page"
                  >
                    {breadcrumb}
                  </li>
                </ol>
                <h6 className="mb-0 font-bold capitalize text-lg">{heading}</h6>
              </nav>
            )}
            <div className="flex items-center">
              <a
                mini-sidenav-burger="true" 
                href="/"
                className="hidden p-0 transition-all ease-nav-brand text-sm text-slate-500 xl:block"
                aria-expanded="false"
              >
                <div className="w-4.5 overflow-hidden">
                  <i className="ease-soft mb-0.75 relative block h-0.5 translate-x-[5px] rounded-sm bg-slate-500 transition-all dark:bg-white"></i>
                  <i className="ease-soft mb-0.75 relative block h-0.5 rounded-sm bg-slate-500 transition-all dark:bg-white"></i>
                </div>
              </a>
            </div>
            <div
              className="flex items-center mt-2 grow sm:mt-0 sm:mr-6 md:mr-0 lg:flex lg:basis-auto"
              id="navbar"
            >
              <div className="flex items-center md:ml-auto md:pr-1"></div>
              <ul className="flex flex-row justify-end pl-0 mb-0 list-none md-max:w-full">
                <li className="flex items-center">
                  <a
                    href="./pages/authentication/signin/illustration.html"
                    className="block px-0 py-2 font-semibold transition-all ease-nav-brand text-sm text-slate-500 dark:text-white"
                  ></a>
                </li>
                <li className="flex items-center pl-4">
                  <a
                    sidenav-trigger=""
                    className="block p-0 transition-all ease-nav-brand text-sm text-slate-500 dark:text-white"
                    href="/"
                    aria-expanded="false"
                  >
            <div className="w-4.5 overflow-hidden">
              <i className="ease-soft mb-0.75 relative block h-0.5 rounded-sm bg-slate-500 transition-all dark:bg-white"></i>
              <i className="ease-soft mb-0.75 relative block h-0.5 rounded-sm bg-slate-500 transition-all dark:bg-white"></i>
              <i className="ease-soft relative block h-0.5 rounded-sm bg-slate-500 transition-all dark:bg-white"></i>
            </div>
          </a>
        </li>
        {/*  <li className="flex items-center px-4">
          <a href="javascript:;" className="p-0 transition-all text-sm ease-nav-brand text-slate-500 dark:text-white">
            <i fixed-plugin-button-nav="" className="cursor-pointer fa fa-cog" aria-hidden="true"></i>
           
          </a>
        </li>*/}
 
 {!isUserLogin &&  (
              
              <div className="dropdown dropdown-end right-16">
              <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
                <div className="w-10 rounded-full">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-10 hover:text-blue-600">
                    <path fillRule="evenodd" d="M18.685 19.097A9.723 9.723 0 0 0 21.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 0 0 3.065 7.097A9.716 9.716 0 0 0 12 21.75a9.716 9.716 0 0 0 6.685-2.653Zm-12.54-1.285A7.486 7.486 0 0 1 12 15a7.486 7.486 0 0 1 5.855 2.812A8.224 8.224 0 0 1 12 20.25a8.224 8.224 0 0 1-5.855-2.438ZM15.75 9a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
              <ul
                tabIndex={0}
                className="menu menu-sm dropdown-content bg-[#F8F9FA] rounded-box z-[1] mt-3 w-32 p-2 shadow ">
                <li className="">
                  <a className="justify-between">
                    Profile
                    <FontAwesomeIcon icon={faUser} /></a>
                  
                </li>
                <li><a className="justify-between" onClick={handleLogout}>Logout     <FontAwesomeIcon icon={faRightFromBracket} />   </a></li>
              </ul>
            </div>
    )}
     {!isUserLogin &&  (

        <li className="relative flex items-center pr-2 right-10 -mt-1">
          {/* bell icon */}
          <div className="flex space-x-5">
                    {icons.map((icon) => (
                        <label key={icon.id} htmlFor={icon.id}>
                            <input
                                id={icon.id}
                                name="icons"
                                type="radio"
                                className="hidden"
                                checked={selectedIcon === icon.id}
                                onChange={() => setSelectedIcon(icon.id)} />
                            <i
                                className={`${icon.className} ${baseClasses} ${selectedIcon === icon.id ? activeClasses : hoverClasses}`}
                            ></i>
                        </label>
                    ))}
                </div>
 
           
 
            
            
        </li>
        )}
      </ul>
    </div>
  </div>
</nav>

    </div>
    
    </>
  );
};





export default Header;

