// src/pages/WorkMaster.tsx
"use client"

import React, { useState, useEffect } from 'react';
import Header from '../../components/Header';
import { redirect, useRouter } from 'next/navigation';
import SideBar from '../../components/SideBar'; // Ensure correct path to SideBar
import { viewWorkMaster, WorkMasterData,UpdateRoleData, RoleData,deleteRole, addWorkMaster, updateRole, viewDocuments, ViewWorkMasterData, ViewDocumentData, deleteWorkMaster, updateWorkMaster } from '../../apiService';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { usePermissions } from '../../context/PermissionContext';


const ViewRole = () => {

  useEffect(() => {
    const sessionEmail = localStorage.getItem('sessionEmail');
    if (!sessionEmail) {
      redirect('/UserLogin'); // Redirect to a 404 page or your desired route
    }
  }, []);
  
  const { permissions } = usePermissions();

  const [works, setWorks] = useState<ViewWorkMasterData[]>([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);



  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10); // Number of items per page
  const router = useRouter();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);

  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);

  const [selectedCustomer, setSelectedCustomer] = useState<WorkMasterData | null>(null);
  const [selectedDocuments, setSelectedDocuments] = useState<string[]>(['Selected Documents']);


  // State for new work popup
  const [Documents, setDocuments] = useState<ViewDocumentData[]>([]);

  const [searchQuery, setSearchQuery] = useState(''); // Search query state
  const [filteredWorks, setFilteredWorks] = useState<ViewWorkMasterData[]>([]); // Filtered works state

  const [formData, setFormData] = useState({
    work_master: '',
    work_cost: '',
    work_master_id:'',
    work_documents: [] as string[], // Initialize as an empty array
  });
  
  
  const [errors, setErrors] = useState({

    work_master: '',
    work_document:'',
    work_cost: '',


  });







  
 

  const WorkMaster = async () => {
    try {
        const workMasterData = await viewWorkMaster();
        console.log('Fetched roles:', workMasterData);
      setWorks(workMasterData);
      setFilteredWorks(workMasterData);
    } catch (error) {
      console.error('Error fetching roles:', error);
    }
  };
  useEffect(() => {
    WorkMaster();
  }, []);




  const DocumentMaster = async () => {
    try {
      const documentMasterData = await viewDocuments();
      setDocuments(documentMasterData);
    } catch (error) {
      console.error('Error fetching works:', error);
    }
  };
  useEffect(() => {
    DocumentMaster();
  }, []);


  // Calculate pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = works.slice(indexOfFirstItem, indexOfLastItem);

  // Change page  
  const paginate = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };



  // Handle opening the add work popup
  const handleAdd = () => {
    setIsModalOpen(true);
  };

  // Handle closing the add work popup
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setIsViewModalOpen(false);
    setSelectedDocuments([]);

    resetForm();

  };
 

  const handleCloseUpdateModal = () => {
    setIsUpdateModalOpen(false);
    resetForm();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
  };
  

 

  const handleDocumentsSelect = (work_document: string) => {
    const updatedDocuments = formData.work_documents.includes(work_document)
      ? formData.work_documents.filter(doc => doc !== work_document)
      : [...formData.work_documents, work_document];
     
    
    
    setFormData({
      ...formData,
      work_documents: updatedDocuments,
    });
  };


  const handleViewDocuments = (documents: string[]) => {
    setSelectedDocuments(documents);
    setIsViewModalOpen(true);
  };

  const validateForm = () => {
    const newErrors = { ...errors };
    let isValid = true;
  
    if (!formData.work_master) {
      newErrors.work_master = 'WorkMaster Name is required';
      isValid = false;
    }
    if (formData.work_documents.length === 0) {
      newErrors.work_document = 'At least one document must be selected';
      isValid = false;
    }
  
    if (!formData.work_cost) {
      newErrors.work_cost = 'Work Cost is required';
      isValid = false;
    } else if (!/^\d+(\.\d+)?$/.test(formData.work_cost) || Number(formData.work_cost) <= 0) {
      newErrors.work_cost = 'Work Cost must be a positive number';
      isValid = false;
    }
  
    setErrors(newErrors);
    return isValid;
  };
  

  
  const resetForm = () => {
    setFormData({
      work_master: '',
      work_cost: '',
      work_master_id: '',

      work_documents: [], // Initialize as an empty array
    });
    setErrors({
      work_master: '',
      work_cost: '',

      work_document:'',

    });
  };
  

  const handleModalCloseAndReset = () => {
    handleCloseUpdateModal();
    resetForm();
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleDelete = async (index: number) => {
    const workToDelete = currentItems[index];
    try {
      await deleteWorkMaster(workToDelete.work_master_id);
      // Remove role from the local state after deletion
      setWorks(works.filter((_, i) => i !== index));
      toast.success('WorkMaster deleted successfully');
    } catch (error) {
      console.error('Failed to delete Work master:', error);
      toast.error('Error deleting WorkMaster');
    }
  };

  const handleUpdatePopup = (index: number) => {
    const selectedItem = currentItems[index];
    setSelectedCustomer(selectedItem);
    setFormData({
      work_master_id: selectedItem.work_master_id,
      work_master: selectedItem.work_master,
      work_cost: selectedItem.work_cost, // Add work_cost
      work_documents: selectedItem.work_document, // Add work_documents
    });
    setIsUpdateModalOpen(true);
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  if (!validateForm()) {
    return;
  }

  // Trim the formData before submitting
  const trimmedFormData = {
    ...formData,
    work_master: formData.work_master.trim(),
    work_cost: formData.work_cost.trim(),
  };

  try {
    const dataToSubmit = {
      work_master_id: trimmedFormData.work_master_id,
      work_master: trimmedFormData.work_master,
      work_cost: trimmedFormData.work_cost,
      work_document: trimmedFormData.work_documents,
    };

    await addWorkMaster(dataToSubmit);
      toast.success('WorkMaster added successfully');
      WorkMaster();
      handleCloseModal();
    } catch (error) {
      toast.error('Error adding work');
      console.error('Error adding work:', error);
    }
  };
  
  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }
  
    try {
      const dataToSubmit = {
        work_master_id: formData.work_master_id,
        work_master: formData.work_master,
        work_cost: formData.work_cost,
        work_document: formData.work_documents,
      };
  
      await updateWorkMaster(dataToSubmit);
      toast.success('WorkMaster Updated successfully');
      handleCloseUpdateModal();
      WorkMaster();
    } catch (error) {
      toast.error('Error Updating Work master');
      console.error('Error Updating Work master:', error);
    }
  };
  
  useEffect(() => {
    const filtered = works.filter(work =>
      Object.keys(work).some(key =>
        ['work_master', 'work_cost', 'created_by', 'updated_by'].includes(key) &&
        (
          (typeof work[key] === 'string' && work[key].toLowerCase().includes(searchQuery.toLowerCase())) ||
          (typeof work[key] === 'number' && work[key].toString().includes(searchQuery))
        )
      )
    );
    setFilteredWorks(filtered);
  }, [searchQuery, works]);

  return (
    <div className="bg-[#F8F9FA] min-h-screen overflow-hidden">
      <Header />
      <ToastContainer />
      <div className="flex">
        <SideBar /> {/* Render SideBar component */}
        <div className="flex-grow p-12 py-0 mt-2 ml-52 max-h-[85vh] overflow-hidden">
          <div className="mx-auto w-full bg-white p-8 rounded-2xl">
            <div className='flex justify-between'>
            {permissions.includes('create_work_master') && (
              <button
                type="button"
                className="hover:shadow-form rounded-md bg-blue-600 py-1.5 h-[38px]  px-5 mb-5 text-center text-base font-semibold text-white outline-none"
                onClick={handleAdd}
              >
                <i className="fa-solid fa-circle-plus mr-2"></i>Add New Work
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
            {permissions.includes('view_work_master') && (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-blue-600">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider whitespace-nowrap">Sr. NO</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider whitespace-nowrap">Work Master</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider whitespace-nowrap">Work Documents</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Work Cost</th>

                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Created By</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Updated By</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">

                  {filteredWorks.map((work,index) => (
                    <tr key={work.work_master_id}>
                      <td className="hidden">{work.work_master_id}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{index+1}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{work.work_master}</td>

                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          className="text-blue-600 underline"
                          onClick={() => handleViewDocuments(work.work_document)}
                        >
                          View Documents
                        </button>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">{work.work_cost} Rs</td>

                             <td className="px-6 py-4 whitespace-nowrap">{work.created_by}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{work.updated_by}</td>
                      <td className="px-6 py-3 whitespace-nowrap">
                      {permissions.includes('update_work_master') && (
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
                    {permissions.includes('delete_work_master') && (
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
           {permissions.includes('view_work_master') && (
           <nav className="flex items-center justify-between mt-4">
          <div>
            <span className="text-sm font-normal text-gray-500">
              Showing <span className="font-semibold">{Math.min(indexOfFirstItem + 1, works.length)}</span>-
              <span className="font-semibold">{Math.min(indexOfLastItem, works.length)}</span> of{' '}
              <span className="font-semibold">{works.length}</span>&nbsp;entries
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
              {Array.from({ length: Math.ceil(works.length / itemsPerPage) }, (_, index) => (
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
                  disabled={currentPage === Math.ceil(works.length / itemsPerPage)}
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
{isViewModalOpen && (
       
       <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-800 bg-opacity-50">
       <div className="relative bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
         <button
           className="absolute top-2 right-2 text-gray-600 hover:text-gray-900"
        onClick={handleCloseModal}
>
           <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
           </svg>
         </button>

<div className="bg-[#F8F9FA] p-4 rounded-lg shadow">
  <div className="flex items-center">
  <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center text-white">
    <i className="fas fa-building text-xl"></i>
  </div>
  <p className="text-black font-semibold text-lg mb-2.5 ml-4">Documents List</p>
</div>

    <div>
      <ul className="list-disc list-inside  text-md mb-2.5 ml-4">
            {selectedDocuments.map((doc, index) => (
              <li key={index}>{doc}</li>
            ))}
          </ul>
    </div>
   
  </div>






</div></div>






      )}
  {/* Add Work Master Modal */}
  {isModalOpen && (
          <div className="fixed inset-0 z-50 overflow-auto bg-gray-900 bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-8 w-96 rounded-lg">
              <div className="flex justify-between items-center mt-0">
                <h2 className="text-lg font-semibold mb-4">Add New Work Master</h2>
                <i className="fas fa-times -mr-4 -mt-16" onClick={handleCloseModal}></i>
              </div>
              <form onSubmit={handleSubmit}>
                <label htmlFor="work_master" className="mb-2 block text-base font-medium text-[#07074D]">Work Master</label>
                <div className="flex mb-4">
                  <span className="inline-flex items-center px-3 text-sm text-gray-900 bg-gray-200 border border-e-0 border-gray-300 rounded-s-md dark:bg-gray-600 dark:text-gray-400 dark:border-gray-600">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
                      <path fillRule="evenodd" d="M7.5 5.25a3 3 0 0 1 3-3h3a3 3 0 0 1 3 3v.205c.933.085 1.857.197 2.774.334 1.454.218 2.476 1.483 2.476 2.917v3.033c0 1.211-.734 2.352-1.936 2.752A24.726 24.726 0 0 1 12 15.75c-2.73 0-5.357-.442-7.814-1.259-1.202-.4-1.936-1.541-1.936-2.752V8.706c0-1.434 1.022-2.7 2.476-2.917A48.814 48.814 0 0 1 7.5 5.455V5.25Zm7.5 0v.09a49.488 49.488 0 0 0-6 0v-.09a1.5 1.5 0 0 1 1.5-1.5h3a1.5 1.5 0 0 1 1.5 1.5Zm-3 8.25a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Z" clipRule="evenodd" />
                      <path d="M3 18.4v-2.796a4.3 4.3 0 0 0 .713.31A26.226 26.226 0 0 0 12 17.25c2.892 0 5.68-.468 8.287-1.335.252-.084.49-.189.713-.311V18.4c0 1.452-1.047 2.728-2.523 2.923-2.12.282-4.282.427-6.477.427a49.19 49.19 0 0 1-6.477-.427C4.047 21.128 3 19.852 3 18.4Z" />
                    </svg>
                  </span>
                  <input
                    type="text"
                    className="flex-1 min-w-0 w-full text-sm p-2.5 rounded-md border -mb-0 bg-white py-3 px-2 font-medium text-[#6B7280] outline-none focus:border-blue-600 focus:shadow-md"
                    placeholder="Enter Your Work"
                    id="work_master"
                    name="work_master"
                    value={formData.work_master}
                    onChange={handleChange}
                  />
                </div>
                {errors.work_master && <p className="text-red-500 text-xs mb-2">{errors.work_master}</p>}

                <label htmlFor="work_cost" className="mb-2 block text-base font-medium text-[#07074D]">Work Cost</label>
                <div className="flex mb-4">
                  <span className="inline-flex items-center px-3 text-sm text-gray-900 bg-gray-200 border border-e-0 border-gray-300 rounded-s-md dark:bg-gray-600 dark:text-gray-400 dark:border-gray-600">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
                      <path fillRule="evenodd" d="M7.5 5.25a3 3 0 0 1 3-3h3a3 3 0 0 1 3 3v.205c.933.085 1.857.197 2.774.334 1.454.218 2.476 1.483 2.476 2.917v3.033c0 1.211-.734 2.352-1.936 2.752A24.726 24.726 0 0 1 12 15.75c-2.73 0-5.357-.442-7.814-1.259-1.202-.4-1.936-1.541-1.936-2.752V8.706c0-1.434 1.022-2.7 2.476-2.917A48.814 48.814 0 0 1 7.5 5.455V5.25Zm7.5 0v.09a49.488 49.488 0 0 0-6 0v-.09a1.5 1.5 0 0 1 1.5-1.5h3a1.5 1.5 0 0 1 1.5 1.5Zm-3 8.25a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Z" clipRule="evenodd" />
                      <path d="M3 18.4v-2.796a4.3 4.3 0 0 0 .713.31A26.226 26.226 0 0 0 12 17.25c2.892 0 5.68-.468 8.287-1.335.252-.084.49-.189.713-.311V18.4c0 1.452-1.047 2.728-2.523 2.923-2.12.282-4.282.427-6.477.427a49.19 49.19 0 0 1-6.477-.427C4.047 21.128 3 19.852 3 18.4Z" />
                    </svg>
                  </span>
                  <input
                    type="text"
                    className="flex-1 min-w-0 w-full text-sm p-2.5 rounded-md border -mb-0 bg-white py-3 px-2 font-medium text-[#6B7280] outline-none focus:border-blue-600 focus:shadow-md"
                    placeholder="Enter Your Work Cost in Rs"
                    id="work_cost"
                    name="work_cost"
                    value={formData.work_cost}
                    onChange={handleChange}
                  />
                </div>
                {errors.work_cost && <p className="text-red-500 text-xs mb-2">{errors.work_cost}</p>}

              <label htmlFor="work_document" className="mb-2 block text-base font-medium text-[#07074D]">Documents</label>
<div className="relative mb-10 flex">
  <span className="inline-flex items-center px-3 text-sm text-gray-900 bg-gray-200 border border-e-0 border-gray-300 rounded-s-md dark:bg-gray-600 dark:text-gray-400 dark:border-gray-600">
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
      <path fillRule="evenodd" d="M5.625 1.5c-1.036 0-1.875.84-1.875 1.875v17.25c0 1.035.84 1.875 1.875 1.875h12.75c1.035 0 1.875-.84 1.875-1.875V12.75A3.75 3.75 0 0 0 16.5 9h-1.875a1.875 1.875 0 0 1-1.875-1.875V5.25A3.75 3.75 0 0 0 9 1.5H5.625ZM7.5 15a.75.75 0 0 1 .75-.75h7.5a.75.75 0 0 1 0 1.5h-7.5A.75.75 0 0 1 7.5 15Zm.75 2.25a.75.75 0 0 0 0 1.5H12a.75.75 0 0 0 0-1.5H8.25Z" clipRule="evenodd" />
      <path d="M12.971 1.816A5.23 5.23 0 0 1 14.25 5.25v1.875c0 .207.168.375.375.375H16.5a5.23 5.23 0 0 1 3.434 1.279 9.768 9.768 0 0 0-6.963-6.963Z" />
    </svg>
  </span>
  <button
    id="dropdownBgHoverButton"
    className="flex-1 min-w-0 w-full text-sm p-2.5 rounded-md border -mb-0 bg-white py-3 px-2 font-medium text-[#6B7280] outline-none focus:border-blue-600 focus:shadow-md"
    type="button"
    onClick={toggleDropdown}
  >
    <span className="-ml-44">&nbsp;{formData.work_documents.length} selected</span> {/* Display count of selected documents */}
    <svg className="w-4 h-4 float-right mt-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
      <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 4 4 4-4" />
    </svg>
  </button>
  {isDropdownOpen && (
    <div className="absolute z-10 w-full bg-white rounded-lg shadow mt-12">
      <ul className="p-3 space-y-1 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="dropdownBgHoverButton">
        {Array.isArray(Documents) && Documents.map((work_document, index) => (
          <li key={index} className={`...`}>
            <input
              type="checkbox"
              className="..."
              id={`checkbox-${work_document.document_name}`}
              checked={formData.work_documents.includes(work_document.document_name)}
              onChange={() => handleDocumentsSelect(work_document.document_name)}
            />
            <label htmlFor={`checkbox-${work_document.document_name}`} className="ml-2 text-sm font-medium text-gray-900">
              {work_document.document_name}
            </label>
          </li>
        ))}
      </ul>
    </div>
  )}
</div>
{errors.work_document && <p className="text-red-500 text-xs mt-0">{errors.work_document}</p>}
                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white p-3 rounded-md font-semibold"
                >
                  Add Work Master
                </button>
              </form>
            </div>
          </div>
        )}
       {/* Edit WorkMaster Modal */}
       {isUpdateModalOpen && (
        <div className="fixed inset-0 z-50 overflow-auto bg-gray-900 bg-opacity-50 flex items-center justify-center">

          <div className="bg-white p-8 w-96 rounded-lg">
<div className="flex justify-between items-center mt-0">
            <h2 className="text-lg font-semibold mb-4">Update Work Master</h2>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6 -mr-4 -mt-14" onClick={handleModalCloseAndReset}     >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg> 
</div>
             <form onSubmit={handleUpdate}> 
              <label htmlFor="website-admin" className="mb-2  block text-base font-medium text-[#07074D]">WorkMaster</label>
  <div className="flex mb-4">
    <span className="inline-flex items-center px-3 text-sm text-gray-900 bg-gray-200 border border-e-0 border-gray-300 rounded-s-md dark:bg-gray-600 dark:text-gray-400 dark:border-gray-600">
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
  <path fillRule="evenodd" d="M18.685 19.097A9.723 9.723 0 0 0 21.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 0 0 3.065 7.097A9.716 9.716 0 0 0 12 21.75a9.716 9.716 0 0 0 6.685-2.653Zm-12.54-1.285A7.486 7.486 0 0 1 12 15a7.486 7.486 0 0 1 5.855 2.812A8.224 8.224 0 0 1 12 20.25a8.224 8.224 0 0 1-5.855-2.438ZM15.75 9a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" clipRule="evenodd" />
</svg>

    </span>
    <input type="text"  className="flex-1 min-w-0 w-full text-sm p-2.5 rounded-md border mb-0 bg-white py-3 px-2 font-medium text-[#6B7280] outline-none focus:border-blue-600 focus:shadow-md" 
    placeholder="Enter Updated WorkMaster Name"  id="work_master"
                      name="work_master"
  value={formData.work_master}
  onChange={handleChange}   />
  </div>
  {errors.work_master && <p className="text-red-500 text-xs mt-0">{errors.work_master}</p>}
  <label htmlFor="work_cost" className="mb-2 block text-base font-medium text-[#07074D]">Work Cost</label>
                <div className="flex mb-4">
                  <span className="inline-flex items-center px-3 text-sm text-gray-900 bg-gray-200 border border-e-0 border-gray-300 rounded-s-md dark:bg-gray-600 dark:text-gray-400 dark:border-gray-600">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
                      <path fillRule="evenodd" d="M7.5 5.25a3 3 0 0 1 3-3h3a3 3 0 0 1 3 3v.205c.933.085 1.857.197 2.774.334 1.454.218 2.476 1.483 2.476 2.917v3.033c0 1.211-.734 2.352-1.936 2.752A24.726 24.726 0 0 1 12 15.75c-2.73 0-5.357-.442-7.814-1.259-1.202-.4-1.936-1.541-1.936-2.752V8.706c0-1.434 1.022-2.7 2.476-2.917A48.814 48.814 0 0 1 7.5 5.455V5.25Zm7.5 0v.09a49.488 49.488 0 0 0-6 0v-.09a1.5 1.5 0 0 1 1.5-1.5h3a1.5 1.5 0 0 1 1.5 1.5Zm-3 8.25a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Z" clipRule="evenodd" />
                      <path d="M3 18.4v-2.796a4.3 4.3 0 0 0 .713.31A26.226 26.226 0 0 0 12 17.25c2.892 0 5.68-.468 8.287-1.335.252-.084.49-.189.713-.311V18.4c0 1.452-1.047 2.728-2.523 2.923-2.12.282-4.282.427-6.477.427a49.19 49.19 0 0 1-6.477-.427C4.047 21.128 3 19.852 3 18.4Z" />
                    </svg>
                  </span>
                  <input
                    type="text"
                    className="flex-1 min-w-0 w-full text-sm p-2.5 rounded-md border -mb-0 bg-white py-3 px-2 font-medium text-[#6B7280] outline-none focus:border-blue-600 focus:shadow-md"
                    placeholder="Enter Your Work Cost in Rs"
                    id="work_cost"
                    name="work_cost"
                    value={formData.work_cost}
                    onChange={handleChange}
                  />
                </div>
                {errors.work_cost && <p className="text-red-500 text-xs mb-2">{errors.work_cost}</p>}

              <label htmlFor="work_document" className="mb-2 block text-base font-medium text-[#07074D]">Documents</label>
<div className="relative mb-4 flex">
  <span className="inline-flex items-center px-3 text-sm text-gray-900 bg-gray-200 border border-e-0 border-gray-300 rounded-s-md dark:bg-gray-600 dark:text-gray-400 dark:border-gray-600">
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
      <path fillRule="evenodd" d="M5.625 1.5c-1.036 0-1.875.84-1.875 1.875v17.25c0 1.035.84 1.875 1.875 1.875h12.75c1.035 0 1.875-.84 1.875-1.875V12.75A3.75 3.75 0 0 0 16.5 9h-1.875a1.875 1.875 0 0 1-1.875-1.875V5.25A3.75 3.75 0 0 0 9 1.5H5.625ZM7.5 15a.75.75 0 0 1 .75-.75h7.5a.75.75 0 0 1 0 1.5h-7.5A.75.75 0 0 1 7.5 15Zm.75 2.25a.75.75 0 0 0 0 1.5H12a.75.75 0 0 0 0-1.5H8.25Z" clipRule="evenodd" />
      <path d="M12.971 1.816A5.23 5.23 0 0 1 14.25 5.25v1.875c0 .207.168.375.375.375H16.5a5.23 5.23 0 0 1 3.434 1.279 9.768 9.768 0 0 0-6.963-6.963Z" />
    </svg>
  </span>
  <button
    id="dropdownBgHoverButton"
    className="flex-1 min-w-0 w-full text-sm p-2.5 rounded-md border -mb-0 bg-white py-3 px-2 font-medium text-[#6B7280] outline-none focus:border-blue-600 focus:shadow-md"
    type="button"
    onClick={toggleDropdown}
  >
    <span className="-ml-44">&nbsp;{formData.work_documents.length} selected</span> {/* Display count of selected documents */}
    <svg className="w-4 h-4 float-right mt-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
      <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 4 4 4-4" />
    </svg>
  </button>
  {isDropdownOpen && (
    <div className="absolute z-10 w-full bg-white rounded-lg shadow mt-12">
      <ul className="p-3 space-y-1 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="dropdownBgHoverButton">
        {Array.isArray(Documents) && Documents.map((work_document, index) => (
          <li key={index} className={`...`}>
            <input
              type="checkbox"
              className="..."
              id={`checkbox-${work_document.document_name}`}
              checked={formData.work_documents.includes(work_document.document_name)}
              onChange={() => handleDocumentsSelect(work_document.document_name)}
            />
            <label htmlFor={`checkbox-${work_document.document_name}`} className="ml-2 text-sm font-medium text-gray-900">
              {work_document.document_name}
            </label>
          </li>
        ))}
      </ul>
    </div>
  )}
</div>
{errors.work_document && <p className="text-red-500 text-xs mt-0">{errors.work_document}</p>}
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
                              onClick={handleModalCloseAndReset}>

                              <i className="fas fa-times mr-2"></i>
                              Cancel
                            </button>
                          </div>
        </form>             </div>
         
</div>  
)} 
</div></div></div></div>
  );
};

export default ViewRole;

