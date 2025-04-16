"use client"

import React, { useState, useEffect } from 'react';
import Header from '../../components/Header';
import SideBar from '../../components/SideBar';
import { updateUser, RoleData, viewRoles } from '../../apiService';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Link from 'next/link';
import { redirect, usePathname, useSearchParams } from 'next/navigation'; // Import usePathname and useSearchParams

const UpdateUser = () => {

  useEffect(() => {
    const sessionEmail = localStorage.getItem('sessionEmail');
    if (!sessionEmail) {
      redirect('/UserLogin'); // Redirect to a 404 page or your desired route
    }
  }, []);
  
  const [roles, setRoles] = useState<RoleData[]>([]);
  const [openDropdown, setOpenDropdown] = useState(false);
  const [loading, setLoading] = useState(false); // State for loading indicator
  const pathname = usePathname(); // Use usePathname for current pathname
  const searchParams = useSearchParams(); // Use useSearchParams for query parameters
  const [selectedRole, setSelectedRole] = useState<string>('Select user_role'); // Initialize selectedRole state

  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    mobile: '',
    // password: '',
    user_role: '',
  });

  const [errors, setErrors] = useState({
    first_name: '',
    last_name: '',
    email: '',
    mobile: '',
    // password: '',
    user_role: '',
  });

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const rolesData = await viewRoles();
        setRoles(rolesData);
      } catch (error) {
        console.error('Error fetching roles:', error);
      }
    };
    fetchRoles();
  }, []);

  useEffect(() => {
    // Fetch user data from query params on component mount
    if (searchParams) {
      const userQuery = searchParams.get('user');
      if (userQuery) {
        const userData = JSON.parse(userQuery);
        setFormData(userData);
        setSelectedRole(userData.user_role); // Set selectedRole based on user's current role
      }
    }
  }, [searchParams]);

  const toggleDropdown = () => {
    setOpenDropdown(!openDropdown);
  };

  const handleRoleSelect = (user_role: string) => {
    setSelectedRole(user_role);
    setFormData({ ...formData, user_role });
    setOpenDropdown(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
  };

  const validateForm = () => {
    const newErrors = { ...errors };
    let isValid = true;

    // Trim input fields
    const trimmedFirstName = formData.first_name.trim();
    const trimmedLastName = formData.last_name.trim();
    const trimmedEmail = formData.email.trim();
    const trimmedMobile = formData.mobile.trim();

    if (!trimmedFirstName) {
      newErrors.first_name = 'First Name is required';
      isValid = false;
    } else if (!/^[A-Za-z]+$/.test(trimmedFirstName)) {
      newErrors.first_name = 'First Name can only contain letters';
      isValid = false;
    }

    if (!trimmedLastName) {
      newErrors.last_name = 'Last Name is required';
      isValid = false;
    } else if (!/^[A-Za-z]+$/.test(trimmedLastName)) {
      newErrors.last_name = 'Last Name can only contain letters';
      isValid = false;
    }
  
    if (!trimmedEmail) {
      newErrors.email = 'Email is required';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(trimmedEmail)) {
      newErrors.email = 'Email address is invalid';
      isValid = false;
    }
  
    if (!trimmedMobile) {
      newErrors.mobile = 'Mobile number is required';
      isValid = false;
    } else if (!/^\d{10}$/.test(trimmedMobile)) {
      newErrors.mobile = 'Mobile number must be exactly 10 digits';
      isValid = false;
    }
    
    // if (!formData.password) {
    //   newErrors.password = 'Password is required';
    //   isValid = false;
    // }
    if (selectedRole === 'Select user_role') {
      newErrors.user_role = 'Role is required';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }

    // Trim the formData before submitting
    const trimmedFormData = {
      ...formData,
      first_name: formData.first_name.trim(),
      last_name: formData.last_name.trim(),
      email: formData.email.trim(),
      mobile: formData.mobile.trim(),
    };

    try {
      await updateUser(trimmedFormData);
      toast.success('User updated successfully');
      window.location.href = '/ViewUser'; // Navigate back to ViewUser after successful update
    } catch (error) {
      toast.error('Error updating user');
      console.error('Error updating user:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      first_name: '',
      last_name: '',
      email: '',
      mobile: '',
    //   password: '',
      user_role: '',
    });
    setSelectedRole('Select user_role');
    setErrors({
      first_name: '',
      last_name: '',
      email: '',
      mobile: '',
    //   password: '',
      user_role: '',
    });
  };


  return (
 <div className="bg-[#F8F9FA] min-h-screen overflow-hidden">
      <Header />
      <ToastContainer />
       <div className="flex">
        <SideBar/>
        <div className="flex-grow p-12 py-0 mt-2 ml-52 h-full overflow-x-hidden">
          <div className="mx-auto w-full  bg-white p-8 rounded-2xl min-h-[85vh]">
          <div className="flex justify-between">
<form className="w-lg mx-auto mt-10 font-roboto"onSubmit={handleSubmit}> 
    <div className='max-w-sm'>
  <label htmlFor="website-admin" className="mb-2  block text-base font-medium text-[#07074D]">First Name</label>
  <div className="flex mb-4">
    <span className="inline-flex items-center px-3 text-sm text-gray-900 bg-gray-200 border border-e-0 border-gray-300 rounded-s-md dark:bg-gray-600 dark:text-gray-400 dark:border-gray-600">
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
  <path fillRule="evenodd" d="M18.685 19.097A9.723 9.723 0 0 0 21.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 0 0 3.065 7.097A9.716 9.716 0 0 0 12 21.75a9.716 9.716 0 0 0 6.685-2.653Zm-12.54-1.285A7.486 7.486 0 0 1 12 15a7.486 7.486 0 0 1 5.855 2.812A8.224 8.224 0 0 1 12 20.25a8.224 8.224 0 0 1-5.855-2.438ZM15.75 9a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" clipRule="evenodd" />
</svg>

    </span>
    <input type="text"  className="flex-1 min-w-0 w-full text-sm p-2.5 rounded-md border mb-0 bg-white py-3 px-2 font-medium text-[#6B7280] outline-none focus:border-blue-600 focus:shadow-md" placeholder="Enter First Name"  id="first_name"
                      name="first_name"
  value={formData.first_name}
                      onChange={handleChange}
                    />
  </div>
  {errors.first_name && <p className="text-red-500 text-xs mt-0">{errors.first_name}</p>}

  <label htmlFor="website-admin" className="mb-2  block text-base font-medium text-[#07074D]">Last Name</label>
   <div className="flex mb-4">
    <span className="inline-flex items-center px-3 text-sm text-gray-900 bg-gray-200 border border-e-0 border-gray-300 rounded-s-md dark:bg-gray-600 dark:text-gray-400 dark:border-gray-600">
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
  <path fillRule="evenodd" d="M18.685 19.097A9.723 9.723 0 0 0 21.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 0 0 3.065 7.097A9.716 9.716 0 0 0 12 21.75a9.716 9.716 0 0 0 6.685-2.653Zm-12.54-1.285A7.486 7.486 0 0 1 12 15a7.486 7.486 0 0 1 5.855 2.812A8.224 8.224 0 0 1 12 20.25a8.224 8.224 0 0 1-5.855-2.438ZM15.75 9a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" clipRule="evenodd" />
</svg>



    </span>
    <input type="text"  
    className="flex-1 min-w-0 w-full text-sm p-2.5 rounded-md border 
    mb-0 bg-white py-3 px-2 font-medium text-[#6B7280] outline-none focus:border-blue-600 focus:shadow-md" 
    placeholder="Enter Last Name"id="last_name"  name="last_name"
    value={formData.last_name}
                         onChange={handleChange}
                       />
  </div>
  {errors.last_name && <p className="text-red-500 text-xs mt-0">{errors.last_name}</p>}

  <label htmlFor="website-admin" className="mb-2  block text-base font-medium text-[#07074D]">Email</label>
   <div className="flex mb-4">
    <span className="inline-flex items-center px-3 text-sm text-gray-900 bg-gray-200 border border-e-0 border-gray-300 rounded-s-md dark:bg-gray-600 dark:text-gray-400 dark:border-gray-600">
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
  <path d="M1.5 8.67v8.58a3 3 0 0 0 3 3h15a3 3 0 0 0 3-3V8.67l-8.928 5.493a3 3 0 0 1-3.144 0L1.5 8.67Z" />
  <path d="M22.5 6.908V6.75a3 3 0 0 0-3-3h-15a3 3 0 0 0-3 3v.158l9.714 5.978a1.5 1.5 0 0 0 1.572 0L22.5 6.908Z" />
</svg>

    </span>
    <input type="text"  
    className="flex-1 min-w-0 w-full text-sm p-2.5 rounded-md border mb-0 bg-white py-3 
    px-2 font-medium text-[#6B7280] outline-none focus:border-blue-600 focus:shadow-md" 
    placeholder="Enter Email Address"  
                           id="email" name="email" 
  value={formData.email}
                      onChange={handleChange}
                    />
  </div>
  {errors.email && <p className="text-red-500 text-xs mt-0">{errors.email}</p>}

  <label htmlFor="website-admin" className="mb-2  block text-base font-medium text-[#07074D]">Mobile</label>
   <div className="flex mb-4">
    <span className="inline-flex items-center px-3 text-sm text-gray-900 bg-gray-200 border border-e-0 border-gray-300 rounded-s-md dark:bg-gray-600 dark:text-gray-400 dark:border-gray-600">
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
  <path fillRule="evenodd" d="M1.5 4.5a3 3 0 0 1 3-3h1.372c.86 0 1.61.586 1.819 1.42l1.105 4.423a1.875 1.875 0 0 1-.694 1.955l-1.293.97c-.135.101-.164.249-.126.352a11.285 11.285 0 0 0 6.697 6.697c.103.038.25.009.352-.126l.97-1.293a1.875 1.875 0 0 1 1.955-.694l4.423 1.105c.834.209 1.42.959 1.42 1.82V19.5a3 3 0 0 1-3 3h-2.25C8.552 22.5 1.5 15.448 1.5 6.75V4.5Z" clipRule="evenodd" />
</svg>

    </span>
    <input type="text" 
                        className="flex-1 min-w-0 w-full text-sm p-2.5 rounded-md border mb-0 bg-white py-3 px-2 
                        font-medium text-[#6B7280] outline-none focus:border-blue-600 focus:shadow-md" 
                        placeholder="Enter Mobile Number"  id="mobile" name="mobile"
                        value={formData.mobile}
                                            onChange={handleChange}
                                          />
  </div>  
  {errors.mobile && <p className="text-red-500 text-xs mt-0">{errors.mobile}</p>}

  {/* <label htmlFor="website-admin" className="mb-2  block text-base font-medium text-[#07074D]">Password</label>
   <div className="flex mb-4">
    <span className="inline-flex items-center px-3 text-sm text-gray-900 bg-gray-200 border border-e-0 border-gray-300 rounded-s-md dark:bg-gray-600 dark:text-gray-400 dark:border-gray-600">
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
  <path fillRule="evenodd" d="M12 1.5a5.25 5.25 0 0 0-5.25 5.25v3a3 3 0 0 0-3 3v6.75a3 3 0 0 0 3 3h10.5a3 3 0 0 0 3-3v-6.75a3 3 0 0 0-3-3v-3c0-2.9-2.35-5.25-5.25-5.25Zm3.75 8.25v-3a3.75 3.75 0 1 0-7.5 0v3h7.5Z" clipRule="evenodd" />
</svg>

    </span>
    <input type="text"  
                        className="flex-1 min-w-0 w-full text-sm p-2.5 rounded-md border 
                        mb-0 bg-white py-3 px-2 font-medium text-[#6B7280] outline-none
                         focus:border-blue-600 focus:shadow-md" 
                         placeholder="Set Password"  id="password" name="password"
                         value={formData.password}
                                             onChange={handleChange}
                                           />
  </div>
  {errors.password && <p className="text-red-500 text-xs mt-0">{errors.password}</p>} */}

  <label htmlFor="website-admin" className="mb-2  block text-base font-medium text-[#07074D]">Select Role</label>
      <div className="flex mb-4 relative">
        <span className="inline-flex items-center px-3 text-sm text-gray-900 bg-gray-200 border border-e-0 border-gray-300 rounded-s-md dark:bg-gray-600 dark:text-gray-400 dark:border-gray-600">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
            <path fillRule="evenodd" d="M8.25 6.75a3.75 3.75 0 1 1 7.5 0 3.75 3.75 0 0 1-7.5 0ZM15.75 9.75a3 3 0 1 1 6 0 3 3 0 0 1-6 0ZM2.25 9.75a3 3 0 1 1 6 0 3 3 0 0 1-6 0ZM6.31 15.117A6.745 6.745 0 0 1 12 12a6.745 6.745 0 0 1 6.709 7.498.75.75 0 0 1-.372.568A12.696 12.696 0 0 1 12 21.75c-2.305 0-4.47-.612-6.337-1.684a.75.75 0 0 1-.372-.568 6.787 6.787 0 0 1 1.019-4.38Z" clipRule="evenodd" />
            <path d="M5.082 14.254a8.287 8.287 0 0 0-1.308 5.135 9.687 9.687 0 0 1-1.764-.44l-.115-.04a.563.563 0 0 1-.373-.487l-.01-.121a3.75 3.75 0 0 1 3.57-4.047ZM20.226 19.389a8.287 8.287 0 0 0-1.308-5.135 3.75 3.75 0 0 1 3.57 4.047l-.01.121a.563.563 0 0 1-.373.486l-.115.04c-.567.2-1.156.349-1.764.441Z" />
          </svg>
        </span>
        <button
          id="dropdownBgHoverButton"
          data-dropdown-toggle="dropdownBgHover"
          className="flex-1 min-w-0 w-full text-sm p-2.5 rounded-md border mb-0 bg-white py-3 px-2 font-medium text-[#6B7280] outline-none focus:border-blue-600 focus:shadow-md dropdown-button"
          type="button"
          onClick={toggleDropdown}
          >
               
        <span className='flex justify-between'>{selectedRole} <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
  <path fillRule="evenodd" d="M12.53 16.28a.75.75 0 0 1-1.06 0l-7.5-7.5a.75.75 0 0 1 1.06-1.06L12 14.69l6.97-6.97a.75.75 0 1 1 1.06 1.06l-7.5 7.5Z" clipRule="evenodd" />
</svg>
</span>  
        </button>

        {openDropdown && (
          <div id="dropdownBgHover"     className="ml-12 z-10 absolute top-full mt-2 w-48 bg-white rounded-lg shadow dark:bg-gray-700 dropdown-menu max-h-48 overflow-y-auto">

            <ul className="p-3  text-sm text-gray-700 dark:text-gray-200" aria-labelledby="dropdownBgHoverButton">
            {roles.map((user_role, index) => (
                  <li
                  key={index}
                  className={`cursor-pointer select-none relative py-2 px-4 ${
                    selectedRole === user_role.role_name ? 'bg-[#F8F9FA]' : 'hover:bg-[#F8F9FA]'
                  }`}
                  onClick={() => handleRoleSelect(user_role.role_name)}

                >
                {user_role.role_name}
                    
                    <label htmlFor={`radio-${user_role}`} className="w-full ms-2 text-sm font-medium text-gray-900 rounded dark:text-gray-300">
                    </label>
                
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      </div>
      {errors.user_role && <p className="text-red-500 text-xs italic">{errors.user_role}</p>}

      <div className="flex justify-center items-center font-roboto">
                      <button type="submit" className="hover:shadow-form rounded-md bg-blue-600 py-3 px-5 mt-10 text-center text-base font-semibold text-white outline-none">
                  <i className="fas fa-check mr-2"></i>   {loading ? 'Sending...' : 'Submit'}
                </button>
              
                <Link href="/ViewUser">
                    <button
                      type="button"
                      className="hover:shadow-form rounded-md bg-blue-600 py-3 px-5 mt-10 ml-10 text-center text-base font-semibold text-white outline-none"
                    >
                      <i className="fas fa-times mr-2"></i>
                      Cancel
                    </button>
                  </Link>

</div>
</form>

</div>
</div>
</div>
</div>
</div>
);
};

export default UpdateUser;
