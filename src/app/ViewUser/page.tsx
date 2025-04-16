// src/pages/ViewUser.tsx
"use client"


import React, { useState, useEffect } from 'react';
import Header from '../../components/Header';
import { redirect, useRouter } from 'next/navigation';

import SideBar from '../../components/SideBar';  // Ensure correct path to SideBar
import { viewUsers, UserData, deleteUser } from '../../apiService';
import Link from 'next/link';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { showToast } from '../../components/ToastContainer';
import { usePermissions } from '../../context/PermissionContext';



const ViewUser = () => {

  useEffect(() => {
    const sessionEmail = localStorage.getItem('sessionEmail');
    if (!sessionEmail) {
      redirect('/UserLogin'); // Redirect to a 404 page or your desired route
    }
  }, []);
  
  const { permissions } = usePermissions();
  
  const [customers, setCustomers] = useState<UserData[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10); // Number of items per page
  const router = useRouter();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<UserData | null>(null);

  const [searchQuery, setSearchQuery] = useState(''); // Search query state
  const [filteredCustomers, setFilteredCustomers] = useState<UserData[]>([]); // Filtered users state

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const customersData = await viewUsers();
        setCustomers(customersData);
        setFilteredCustomers(customersData); // Initialize filtered customers
      } catch (error) {
        console.error('Error fetching customers:', error);
      }
    };
    fetchCustomers();
  }, []);

  // Calculate pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = customers.slice(indexOfFirstItem, indexOfLastItem);

  // Change page
  const paginate = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };


  const handleView = (index: number) => {
    setSelectedCustomer(currentItems[index]);
    setIsModalOpen(true);
  };

  const handleEdit = (index: number) => {
    setSelectedCustomer(currentItems[index]);
    // Navigate to the UpdateUser page with selected customer data
    router.push(`/UpdateUser?user=${JSON.stringify(currentItems[index])}`);
  };


  const handleDelete = async (index: number) => {
    const userToDelete = currentItems[index];
    try {
      await deleteUser(userToDelete.email);
      showToast('Customer deleted successfully', 'success');

      // Remove user from the local state after deletion
      setCustomers(customers.filter((_, i) => i !== index));
    } catch (error) {
      console.error('Failed to delete user:', error);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedCustomer(null);
  };

  useEffect(() => {
    const filtered = customers.filter(customer =>
      Object.keys(customer).some(key =>
        ['first_name', 'last_name', 'email', 'mobile', 'user_role'].includes(key) &&
        typeof customer[key] === 'string' && customer[key].toLowerCase().includes(searchQuery.toLowerCase())
      )
    );
    setFilteredCustomers(filtered);
  }, [searchQuery, customers]);
  
  
  return (
    <div className="bg-[#F8F9FA] min-h-screen overflow-hidden">

      <Header />
      <ToastContainer />
      <div className="flex">
        <SideBar /> {/* Render SideBar component */}
       
        <div className="flex-grow p-12 py-0 mt-2 ml-52 max-h-[85vh] overflow-hidden">
          <div className="mx-auto w-full bg-white p-8 rounded-2xl">
          <div className='flex justify-between'>
          {permissions.includes('create_user') && (
        <button
          type="button"
          className="hover:shadow-form rounded-md bg-blue-600 py-1.5 h-[38px] px-5 mb-5 text-center text-base font-semibold text-white outline-none"
        >
          <Link href="/AddUser" passHref>
            
              <i className="fa-solid fa-circle-plus mr-2"></i>Add New Employee
          
          </Link>
        </button>
        )}
            <div className="flex justify-end">
              
              <div className="right-5 mr-5">
                <div className="top-0 mt-0 mb-6 max-w-xl py-1 px-6 rounded-full bg-[#F8F9FA] border flex focus-within:border-[#F8F9FA]">
                <input
                  type="text"
                  placeholder="Search here"
                  className="bg-transparent w-full focus:outline-none pr-4 font-semibold border-0 focus:ring-0 px-0 py-0"
                  name="topic"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button className="flex flex-row items-center justify-center min-w-[130px] px-4 rounded-full border disabled:cursor-not-allowed disabled:opacity-50 transition ease-in-out duration-150 text-base bg-blue-600 text-white font-medium tracking-wide border-transparent py-1.5 h-[38px] -mr-4">
                  Search
                </button>
                </div>
              </div>
            </div>
            </div>
            {permissions.includes('view_user') && (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-blue-600">
                  <tr>                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider whitespace-nowrap">Sr. No</th>


                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider whitespace-nowrap">First Name</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider whitespace-nowrap">Last Name</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Email</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Mobile</th>
                    {/* <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Password</th> */}
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">User Role</th>

                     <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Actions</th>
                   
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                {filteredCustomers.map((user, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap">{index+1}</td>

                      <td className="px-6 py-4 whitespace-nowrap">{user.first_name}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{user.last_name}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{user.email}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{user.mobile}</td>
                      {/* <td className="px-6 py-4 whitespace-nowrap">{user.password}</td> */}
                      <td className="px-6 py-4 whitespace-nowrap">{user.user_role}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex space-x-2">
                      {permissions.includes('update_user') && (
  <div className="tooltip" data-tip="Edit">
    <a
      className="flex items-center rounded-md px-2 py-0 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
      onClick={() => handleEdit(index)} // replace with your edit handler
    >
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
        <path d="M21.731 2.269a2.625 2.625 0 0 0-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 0 0 0-3.712ZM19.513 8.199l-3.712-3.712-8.4 8.4a5.25 5.25 0 0 0-1.32 2.214l-.8 2.685a.75.75 0 0 0 .933.933l2.685-.8a5.25 5.25 0 0 0 2.214-1.32l8.4-8.4Z" />
        <path d="M5.25 5.25a3 3 0 0 0-3 3v10.5a3 3 0 0 0 3 3h10.5a3 3 0 0 0 3-3V13.5a.75.75 0 0 0-1.5 0v5.25a1.5 1.5 0 0 1-1.5 1.5H5.25a1.5 1.5 0 0 1-1.5-1.5V8.25a1.5 1.5 0 0 1 1.5-1.5h5.25a.75.75 0 0 0 0-1.5H5.25Z" />
      </svg>
    </a>
  </div>
  )}
  {permissions.includes('delete_user') && (
  <div className="tooltip" data-tip="Delete">
    <a
      className="flex items-center rounded-md px-2 py-0 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
      onClick={() => handleDelete(index)} // replace with your delete handler
    >
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
        <path fillRule="evenodd" d="M16.5 4.478v.227a48.816 48.816 0 0 1 3.878.512.75.75 0 1 1-.256 1.478l-.209-.035-1.005 13.07a3 3 0 0 1-2.991 2.77H8.084a3 3 0 0 1-2.991-2.77L4.087 6.66l-.209.035a.75.75 0 0 1-.256-1.478A48.567 48.567 0 0 1 7.5 4.705v-.227c0-1.564 1.213-2.9 2.816-2.951a52.662 52.662 0 0 1 3.369 0c1.603.051 2.815 1.387 2.815 2.951Zm-6.136-1.452a51.196 51.196 0 0 1 3.273 0C14.39 3.05 15 3.684 15 4.478v.113a49.488 49.488 0 0 0-6 0v-.113c0-.794.609-1.428 1.364-1.452Zm-.355 5.945a.75.75 0 1 0-1.5.058l.347 9a.75.75 0 1 0 1.499-.058l-.346-9Zm5.48.058a.75.75 0 1 0-1.498-.058l-.347 9a.75.75 0 0 0 1.5.058l.345-9Z" clipRule="evenodd" />
      </svg>
    </a>
  </div>
  )}
</div>

</td>

                      {/* <td className="px-6 py-4 whitespace-nowrap">{user.spoc_name}</td>
                      
                      <td className="px-6 py-4 whitespace-nowrap">{user.company_gst}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{user.company_registration_number}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{user.company_mobile}</td> */}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            )}
            {/* Pagination */}
            {permissions.includes('view_user') && (
            <nav className="flex items-center justify-between mt-4">
  <div>
    <span className="text-sm font-normal text-gray-500">
      Showing <span className="font-semibold">{Math.min(indexOfFirstItem + 1, customers.length)}</span>-
      <span className="font-semibold">{Math.min(indexOfLastItem, customers.length)}</span> of{' '}
      <span className="font-semibold">{customers.length}</span>&nbsp;entries
    </span>
  </div>
  <div>
    <ul className="flex items-center space-x-1 font-light">
      <li className="border border-gray-300 rounded-full text-gray-500 hover:bg-gray-200 hover:border-gray-200 bg-white">
        <button
          onClick={() => paginate(currentPage - 1)}
          className="w-8 h-8 flex items-center justify-center"
          disabled={currentPage === 1}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>
      </li>
      {Array.from({ length: Math.ceil(customers.length / itemsPerPage) }, (_, index) => (
        <li
          key={index}
          className={`border border-gray-300  rounded-full text-gray-500  ${
            currentPage === index + 1 ? 'bg-blue-600 border-blue-600 text-white' : 'hover:bg-gray-200 hover:border-gray-200'
          }`}
        >
          <button
            onClick={() => paginate(index + 1)}
            className="w-8 h-8 flex items-center justify-center"
          >
            {index + 1}
          </button>
        </li>
      ))}
      <li className="border border-gray-300 rounded-full text-gray-500 hover:bg-gray-200 hover:border-gray-200 bg-white">
        <button
          onClick={() => paginate(currentPage + 1)}
          className="w-8 h-8 flex items-center justify-center"
          disabled={currentPage === Math.ceil(customers.length / itemsPerPage)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>
      </li>
    </ul>
  </div>
</nav>
            )}

          </div>
        </div>
      </div>
     
    </div>
  );
};

export default ViewUser;
