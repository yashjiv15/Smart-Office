// src/pages/ViewCustomer.tsx
"use client"


import React, { useState, useEffect } from 'react';
import Header from '../../components/Header';
import SideBar from '../../components/SideBar';  // Ensure correct path to SideBar
import { viewCustomers, ViewCustomerData, deleteCustomer } from '../../apiService';
import CustomerDetailModal from '../../components/CustomerDetailModal';
import ToastContainer, { showToast } from '../../components/ToastContainer'; // Adjust the path as necessary
import Link from 'next/link';
import { usePermissions } from '../../context/PermissionContext';
import { redirect } from 'next/navigation';


const ViewCustomer = () => {

  useEffect(() => {
    const sessionEmail = localStorage.getItem('sessionEmail');
    if (!sessionEmail) {
      redirect('/UserLogin'); // Redirect to a 404 page or your desired route
    }
  }, []);
  
  const { permissions } = usePermissions();

  const [customers, setCustomers] = useState<ViewCustomerData[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10); // Number of items per page
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<ViewCustomerData | null>(null);

  const [searchQuery, setSearchQuery] = useState(''); // Search query state
  const [filteredCustomers, setFilteredCustomers] = useState<ViewCustomerData[]>([]); // Filtered customers state

  const fetchCustomers = async () => {
    try {
      const ViewCustomerData = await viewCustomers();
      setCustomers(ViewCustomerData);
      setFilteredCustomers(ViewCustomerData); // Initialize filtered customers
    } catch (error) {
      console.error('Error fetching customers:', error);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

 // Update filtered customers based on search query
 useEffect(() => {
  const filtered = customers.filter(customer =>
    Object.keys(customer).some(key =>
      ['first_name', 'last_name', 'email', 'mobile','pan','adhaar','spoc_name', 'spoc_mobile', 'company_name','company_gst','company_registration_number','company_mobile'].includes(key) && // Add your relevant keys here
      typeof customer[key] === 'string' && customer[key].toLowerCase().includes(searchQuery.toLowerCase())
    )
  );
  setFilteredCustomers(filtered);
}, [searchQuery, customers]);
  

  // Calculate pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredCustomers.slice(indexOfFirstItem, indexOfLastItem);

  // Change page
  const paginate = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const handleView = (index: number) => {
    setSelectedCustomer(currentItems[index]);
    setIsModalOpen(true);
  };

  const handleEdit = (index: number) => {
    // Assuming you are using Next.js for routing
    window.location.href = `/UpdateCustomer?customer=${JSON.stringify(currentItems[index])}`;
  };

  const handleDelete = (index: number) => {
    const customer_id = currentItems[index].customer_id;
    deleteCustomer({ customer_id })
      .then((response) => {
        console.log(response);
        showToast('Customer deleted successfully', 'success');
        fetchCustomers();
      })
      .catch((error) => {
        console.error(error);
        showToast(error.message, 'error');
      });
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedCustomer(null);
  };
  
  return (
    <div className="bg-[#F8F9FA] min-h-screen overflow-hidden">

      <Header />
      <ToastContainer />
      <div className="flex">
        <SideBar /> {/* Render SideBar component */}
       
        <div className="flex-grow p-12 py-0 mt-2 ml-52 max-h-[85vh] overflow-hidden">
          <div className="mx-auto w-full bg-white p-8 rounded-2xl">

          <div className='flex justify-between'>
          {permissions.includes('create_customer') && (
        <button
          type="button"
          className="hover:shadow-form rounded-md bg-blue-600 py-1.5 h-[38px] px-5 mb-5 text-center text-base font-semibold text-white outline-none"
        >
          <Link href="/AddCustomer" passHref>
            
              <i className="fa-solid fa-circle-plus mr-2"></i>Add New Customer
          
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
            {permissions.includes('view_customer') && (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-blue-600">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider whitespace-nowrap">First Name</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider whitespace-nowrap">Last Name</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Email</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Mobile</th>
                    
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">SPOC Mobile</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Company Name</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">&nbsp;&nbsp;&nbsp;Actions</th>

                
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                {currentItems.map((customer, index) => (
                    <tr key={customer.customer_id}>
                      <td className="px-6 py-4 whitespace-nowrap">{customer.first_name}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{customer.last_name}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{customer.email}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{customer.mobile}</td>
                      
                      <td className="px-6 py-4 whitespace-nowrap">{customer.spoc_mobile}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{customer.company_name}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex space-x-2">
  <div className="tooltip" data-tip="View">
    <a
      className="flex items-center rounded-md px-2 py-0 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
      onClick={() => handleView(index)} // replace with your view handler
    >
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
        <path d="M11.625 16.5a1.875 1.875 0 1 0 0-3.75 1.875 1.875 0 0 0 0 3.75Z" />
        <path fillRule="evenodd" d="M5.625 1.5H9a3.75 3.75 0 0 1 3.75 3.75v1.875c0 1.036.84 1.875 1.875 1.875H16.5a3.75 3.75 0 0 1 3.75 3.75v7.875c0 1.035-.84 1.875-1.875 1.875H5.625a1.875 1.875 0 0 1-1.875-1.875V3.375c0-1.036.84-1.875 1.875-1.875Zm6 16.5c.66 0 1.277-.19 1.797-.518l1.048 1.048a.75.75 0 0 0 1.06-1.06l-1.047-1.048A3.375 3.375 0 1 0 11.625 18Z" clipRule="evenodd" />
        <path d="M14.25 5.25a5.23 5.23 0 0 0-1.279-3.434 9.768 9.768 0 0 1 6.963 6.963A5.23 5.23 0 0 0 16.5 7.5h-1.875a.375.375 0 0 1-.375-.375V5.25Z" />
      </svg>
    </a>
  </div>
  {permissions.includes('update_customer') && (
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
  {permissions.includes('delete_customer') && (
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

                      
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
            {/* Pagination */}
            {permissions.includes('view_customer') && (
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
          disabled={indexOfLastItem >= filteredCustomers.length}
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
</nav>)}

          </div>
        </div>
      </div>
      {isModalOpen && selectedCustomer && (
        <CustomerDetailModal customer={selectedCustomer} onClose={handleCloseModal} isOpen={true} />
      )}
    </div>
  );
};

export default ViewCustomer;
