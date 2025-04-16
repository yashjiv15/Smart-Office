// src/pages/RoleMaster.tsx
"use client"


import React, { useState, useEffect } from 'react';
import Header from '../../components/Header';
import { redirect, useRouter } from 'next/navigation';
import SideBar from '../../components/SideBar'; // Ensure correct path to SideBar
import { viewRoles, RoleData,UpdateRoleData, deleteRole, addRole, updateRole } from '../../apiService';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { usePermissions } from '../../context/PermissionContext';

const RoleMaster = () => {

  useEffect(() => {
    const sessionEmail = localStorage.getItem('sessionEmail');
    if (!sessionEmail) {
      redirect('/UserLogin'); // Redirect to a 404 page or your desired route
    }
  }, []);
  
  const { permissions } = usePermissions();

  const [roles, setRoles] = useState<RoleData[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10); // Number of items per page
  const router = useRouter();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);

  const [selectedCustomer, setSelectedCustomer] = useState<RoleData | null>(null);

  const [searchQuery, setSearchQuery] = useState(''); // Search query state
  const [filteredRoles, setFilteredRoles] = useState<RoleData[]>([]); // Filtered customers state
  
  // State for new role popup
  const [newRoleName, setNewRoleName] = useState('');
  const [formData, setFormData] = useState({
    role_name: '',
    old_role_name: '',
   
  });
  const [errors, setErrors] = useState({
    role_name: '',
    old_role_name: '',
   
  });


  const fetchRoles = async () => {
    try {
      const roleData = await viewRoles();
      console.log('Fetched roles:', roleData);
      setRoles(roleData);
      setFilteredRoles(roleData);
    } catch (error) {
      console.error('Error fetching roles:', error);
    }
  };
  useEffect(() => {
    fetchRoles();
  }, []);


  // Calculate pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = roles.slice(indexOfFirstItem, indexOfLastItem);

  // Change page
  const paginate = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const handleView = (index: number) => {
    setSelectedCustomer(currentItems[index]);
    setIsModalOpen(true);
  };



  const handleDelete = async (index: number) => {
    const userToDelete = currentItems[index];
    try {
      await deleteRole(userToDelete.role_name);
      // Remove role from the local state after deletion
      setRoles(roles.filter((_, i) => i !== index));
    } catch (error) {
      console.error('Failed to delete role:', error);
    }
  };

  // Handle opening the add role popup
  const handleAdd = () => {
    setIsModalOpen(true);
  };
  const handleUpdatePopup = (index: number) => {
    setSelectedCustomer(currentItems[index]);
    setFormData({ role_name: currentItems[index].role_name ,old_role_name: currentItems[index].role_name }); // Set role_name in formData
    setIsUpdateModalOpen(true);
  };
  // Handle closing the add role popup
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setNewRoleName(''); // Clear input field
    resetForm();

  };
  const handleCloseUpdateModal = () => {
    setIsUpdateModalOpen(false);
    setNewRoleName(''); // Clear input field
    resetForm();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
  };

  const validateForm = () => {
    const newErrors = { ...errors };
    let isValid = true;

    if (!formData.role_name) {
      newErrors.role_name = 'Role Name is required';
      isValid = false;
    } else if (!/^[A-Za-z]+$/.test(formData.role_name)) {
      newErrors.role_name = 'Role Name should only contain letters';
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

    try {
      await addRole(formData);
      toast.success('Role added successfully');
      fetchRoles();
      handleCloseModal();
    } catch (error) {
      toast.error('Error adding role');
      console.error('Error adding role:', error);
    }
  };
  const resetForm = () => {
    setFormData({
      role_name: '',
      old_role_name:'',
      
    });
    setErrors({
      role_name: '',
      old_role_name:'',

     
    });
  };

  const handleModalCloseAndReset = () => {
    handleCloseUpdateModal();
    resetForm();
  };


  const handleUpdate = async (e: React.FormEvent) => {
   

    e.preventDefault();
    if (!validateForm()) {
      return;
    }

    try {
      await updateRole(formData);
      toast.success('Role Updated successfully');
      handleCloseUpdateModal();
      fetchRoles();

    } catch (error) {
      toast.error('Error adding role');
      console.error('Error adding role:', error);
    }
  };
 
  useEffect(() => {
    const filtered = roles.filter(work =>
      Object.keys(work).some(key =>
        ['role_name', 'created_by', 'updated_by'].includes(key) &&
        (
          (typeof work[key] === 'string' && work[key].toLowerCase().includes(searchQuery.toLowerCase())) ||
          (typeof work[key] === 'number' && work[key].toString().includes(searchQuery))
        )
      )
    );
    setFilteredRoles(filtered);
  }, [searchQuery, roles]);

  return (
    <div className="bg-[#F8F9FA] min-h-screen overflow-hidden">
      <Header />
      <ToastContainer />
      <div className="flex">
        <SideBar /> {/* Render SideBar component */}
        <div className="flex-grow p-12 py-0 mt-2 ml-52 max-h-[85vh] overflow-hidden">
          <div className="mx-auto w-full bg-white p-8 rounded-2xl">
            <div className='flex justify-between'>
            {permissions.includes('create_roles') && (
              <button
                type="button"
                className="hover:shadow-form rounded-md bg-blue-600 py-1.5 h-[38px]  px-5 mb-5 text-center text-base font-semibold text-white outline-none"
                onClick={handleAdd}
              >
                <i className="fa-solid fa-circle-plus mr-2"></i> New Role
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
            {permissions.includes('view_roles') && (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-blue-600">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider whitespace-nowrap">Sr. No</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider whitespace-nowrap">Role</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Created By</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Updated By</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Active</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                {filteredRoles.map((role,index) => (
                    <tr key={role.role_id}>
                      <td className="hidden">{role.role_id}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{index+1}</td>

                      <td className="px-6 py-4 whitespace-nowrap">{role.role_name}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{role.created_by}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{role.updated_by}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{role.is_deleted ? 'False' : 'True'}</td>
                      <td className="px-6 py-3 whitespace-nowrap">
                      {permissions.includes('update_roles') && (
                      <div className="tooltip" data-tip="Edit">
                        <a
                          className="flex items-center rounded-md px-2 py-0 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                          onClick={() => handleUpdatePopup(index)}
                          >
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                            <path d="M21.731 2.269a2.625 2.625 0 0 0-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 0 0 0-3.712ZM19.513 8.199l-3.712-3.712-8.4 8.4a5.25 5.25 0 0 0-1.32 2.214l-.8 2.685a.75.75 0 0 0 .933.933l2.685-.8a5.25 5.25 0 0 0 2.214-1.32l8.4-8.4Z" />
                            <path d="M5.25 5.25a3 3 0 0 0-3 3v10.5a3 3 0 0 0 3 3h10.5a3 3 0 0 0 3-3V13.5a.75.75 0 0 0-1.5 0v5.25a1.5 1.5 0 0 1-1.5 1.5H5.25a1.5 1.5 0 0 1-1.5-1.5V8.25a1.5 1.5 0 0 1 1.5-1.5h5.25a.75.75 0 0 0 0-1.5H5.25Z" />
                          </svg>
                        </a>
                      </div>
                      )}
                      {permissions.includes('delete_roles') && (
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
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            )}
           {/* Pagination */}
           {permissions.includes('view_roles') && (
           <nav className="flex items-center justify-between mt-4">
          <div>
            <span className="text-sm font-normal text-gray-500">
              Showing <span className="font-semibold">{Math.min(indexOfFirstItem + 1, roles.length)}</span>-
              <span className="font-semibold">{Math.min(indexOfLastItem, roles.length)}</span> of{' '}
              <span className="font-semibold">{roles.length}</span>&nbsp;entries
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
              {Array.from({ length: Math.ceil(roles.length / itemsPerPage) }, (_, index) => (
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
                  disabled={currentPage === Math.ceil(roles.length / itemsPerPage)}
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
      {/* Add Role Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-auto bg-gray-900 bg-opacity-50 flex items-center justify-center">

          <div className="bg-white p-8 w-96 rounded-lg">
<div className="flex justify-between items-center mt-0">
            <h2 className="text-lg font-semibold mb-4">Add New Role</h2>
            <i className="fas fa-times -mr-4 -mt-16"  onClick={handleCloseModal} ></i>
</div>
            <form onSubmit={handleSubmit}>
             
              <label htmlFor="website-admin" className="mb-2  block text-base font-medium text-[#07074D]">Role</label>
  <div className="flex mb-4">
    <span className="inline-flex items-center px-3 text-sm text-gray-900 bg-gray-200 border border-e-0 border-gray-300 rounded-s-md dark:bg-gray-600 dark:text-gray-400 dark:border-gray-600">
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
  <path fillRule="evenodd" d="M18.685 19.097A9.723 9.723 0 0 0 21.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 0 0 3.065 7.097A9.716 9.716 0 0 0 12 21.75a9.716 9.716 0 0 0 6.685-2.653Zm-12.54-1.285A7.486 7.486 0 0 1 12 15a7.486 7.486 0 0 1 5.855 2.812A8.224 8.224 0 0 1 12 20.25a8.224 8.224 0 0 1-5.855-2.438ZM15.75 9a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" clipRule="evenodd" />
</svg>

    </span>
    <input type="text"  className="flex-1 min-w-0 w-full text-sm p-2.5 rounded-md border mb-0 bg-white py-3 px-2 font-medium text-[#6B7280] outline-none focus:border-blue-600 focus:shadow-md" 
    placeholder="i.e Super-Admin , Admin"  id="role_name"
                      name="role_name"
  value={formData.role_name}
  onChange={handleChange}   />
  </div>
  {errors.role_name && <p className="text-red-500 text-xs mt-0">{errors.role_name}</p>}
              <div className="flex justify-around mt-10">
               
              
                   
           
                    <button
                type="button"
                className="hover:shadow-form rounded-md bg-blue-600 py-1.5 h-[38px]  px-5  text-center text-base font-semibold text-white outline-none"
              onClick={handleSubmit} 
            >
              
              <i className="fas fa-check mr-2"></i>  
              Submit
              </button>
              <button
                type="button"
                className="hover:shadow-form rounded-md bg-blue-600 py-1.5 h-[38px]  px-5  text-center text-base font-semibold text-white outline-none"
                onClick={handleCloseModal} >
              
                                    <i className="fas fa-times mr-2"></i>
                                   Cancel
              </button>

              </div>
            </form>
          </div>
        </div>
      )}
       {/* Edit Role Modal */}
       {isUpdateModalOpen && (
        <div className="fixed inset-0 z-50 overflow-auto bg-gray-900 bg-opacity-50 flex items-center justify-center">

          <div className="bg-white p-8 w-96 rounded-lg">
<div className="flex justify-between items-center mt-0">
            <h2 className="text-lg font-semibold mb-4">Update Role</h2>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6 -mr-4 -mt-14" onClick={handleModalCloseAndReset}     >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg> 
</div>
            <form onSubmit={handleUpdate}>
             
              <label htmlFor="website-admin" className="mb-2  block text-base font-medium text-[#07074D]">Role</label>
  <div className="flex mb-4">
    <span className="inline-flex items-center px-3 text-sm text-gray-900 bg-gray-200 border border-e-0 border-gray-300 rounded-s-md dark:bg-gray-600 dark:text-gray-400 dark:border-gray-600">
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
  <path fillRule="evenodd" d="M18.685 19.097A9.723 9.723 0 0 0 21.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 0 0 3.065 7.097A9.716 9.716 0 0 0 12 21.75a9.716 9.716 0 0 0 6.685-2.653Zm-12.54-1.285A7.486 7.486 0 0 1 12 15a7.486 7.486 0 0 1 5.855 2.812A8.224 8.224 0 0 1 12 20.25a8.224 8.224 0 0 1-5.855-2.438ZM15.75 9a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" clipRule="evenodd" />
</svg>

    </span>
    <input type="text"  className="flex-1 min-w-0 w-full text-sm p-2.5 rounded-md border mb-0 bg-white py-3 px-2 font-medium text-[#6B7280] outline-none focus:border-blue-600 focus:shadow-md" 
    placeholder="Enter Updated Role Name"  id="role_name"
                      name="role_name"
  value={formData.role_name}
  onChange={handleChange}   />
  </div>
  {errors.role_name && <p className="text-red-500 text-xs mt-0">{errors.role_name}</p>}
              <div className="flex justify-around mt-10">
              <button
                type="submit"
                className="hover:shadow-form rounded-md bg-blue-600 py-1.5 h-[38px]  px-5  text-center text-base font-semibold text-white outline-none"
            >
              
              <i className="fas fa-check mr-2"></i>  
              Submit
              </button>
              
                    <button
                type="button"
                className="hover:shadow-form rounded-md bg-blue-600 py-1.5 h-[38px]  px-5  text-center text-base font-semibold text-white outline-none"
                onClick={handleModalCloseAndReset}     >
              
                                    <i className="fas fa-times mr-2"></i>
                                   Cancel
              </button>

           
                  
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
    </div></div></div>
  );
};

export default RoleMaster;
