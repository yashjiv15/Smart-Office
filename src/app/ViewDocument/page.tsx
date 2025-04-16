"use client"
import React, { useState, useEffect } from 'react';
import Header from '../../components/Header';
import SideBar from '../../components/SideBar'; // Ensure correct path to SideBar
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { addDocument, deleteDocument, updateDocument, ViewDocumentData, viewDocuments } from '../../apiService';
import { usePermissions } from '../../context/PermissionContext';
import { redirect } from 'next/navigation';


const ViewDocument = () => {

  useEffect(() => {
    const sessionEmail = localStorage.getItem('sessionEmail');
    if (!sessionEmail) {
      redirect('/UserLogin'); // Redirect to a 404 page or your desired route
    }
  }, []);
  
    const { permissions } = usePermissions();

    const [documents, setDocuments] = useState<ViewDocumentData[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10); // Number of items per page
    const [isModalOpen, setIsModalOpen] = useState(false);

    // State for new role popup
    const [newDocumentName, setNewDocumentName] = useState('');
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);

    const [selectedDocument, setSelectedDocument] = useState<ViewDocumentData | null>(null);

    const [searchQuery, setSearchQuery] = useState(''); // Search query state
    const [filteredDocuments, setFilteredDocuments] = useState<ViewDocumentData[]>([]); // Filtered documents state

const [formData, setFormData] = useState({
  document_name: '',
  old_document_name: '',
 
});
const [errors, setErrors] = useState({
  document_name: '',
  old_document_name: '',
 
});

// State for update document form
const [updateFormData, setUpdateFormData] = useState({
    document_name: '',
    old_document_name: '',
  });

    const fetchDocuments = async () => {
        try {
          const ViewDocumentData = await viewDocuments();
          setDocuments(ViewDocumentData);
          setFilteredDocuments(ViewDocumentData);
        } catch (error) {
          console.error('Error fetching customers:', error);
        }
      };
    
      useEffect(() => {
        fetchDocuments();
      }, []);
    

// Calculate pagination
const indexOfLastItem = currentPage * itemsPerPage;
const indexOfFirstItem = indexOfLastItem - itemsPerPage;
const currentItems = documents.slice(indexOfFirstItem, indexOfLastItem);

// Change page
const paginate = (pageNumber: number) => {
  setCurrentPage(pageNumber);
};



const handleAdd = () => {
    setIsModalOpen(true);
  };

   // Handle closing the add document popup
   const handleCloseModal = () => {
    setIsModalOpen(false);
    setNewDocumentName(''); // Clear input field
    resetForm();

  };

  const resetForm = () => {
    setFormData({
        document_name: '',
      old_document_name:'',
      
    });
    setErrors({
        document_name: '',
      old_document_name:'',

     
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
  };

  const toTitleCase = (str: string): string => {
    return str
      .toLowerCase()
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const validateForm = () => {
    const newErrors = { ...errors };
    let isValid = true;
  
    if (!formData.document_name.trim()) {
      newErrors.document_name = 'Document Name is required';
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
  
    // Trim and convert document name to title case before saving
   formData.document_name = toTitleCase(formData.document_name.trim());

    try {
      await addDocument(formData);
      toast.success('Document added successfully');
      fetchDocuments();
      handleCloseModal();
    } catch (error) {
      toast.error('Error adding document');
      console.error('Error adding document:', error);
    }
  };
  

  const handleUpdatePopup = (index: number) => {
    setSelectedDocument(currentItems[index]);
    setFormData({ document_name: currentItems[index].document_name ,old_document_name: currentItems[index].document_name }); // Set document_name in formData
    setIsUpdateModalOpen(true);
  };

  const handleCloseUpdateModal = () => {
    setIsUpdateModalOpen(false);
    setNewDocumentName(''); // Clear input field
    resetForm();
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

    // Trim and convert document name to title case before updating
  formData.document_name = toTitleCase(formData.document_name.trim());

    const updateData = {
        document_name: formData.document_name,
        old_document_name: selectedDocument?.document_name || '',
    };

    try {
        await updateDocument(updateData);
        toast.success('Document updated successfully');
        handleCloseUpdateModal();
        fetchDocuments();
    } catch (error) {
        toast.error('Error updating document');
        console.error('Error updating document:', error);
    }
};

const handleDelete = async (index: number) => {
    const userToDelete = currentItems[index];
    try {
      await deleteDocument(userToDelete.document_name);
      // Remove role from the local state after deletion
      setDocuments(documents.filter((_, i) => i !== index));
      toast.success('Document deleted successfully');

    } catch (error) {
      toast.error('Failed to delete document');
      console.error('Failed to delete role:', error);
    }
  };

  useEffect(() => {
    const filtered = documents.filter(document =>
      Object.keys(document).some(key => {
        if (key === 'is_deleted') {
          return document[key].toString().toLowerCase() === searchQuery.toLowerCase();
        } else if (['document_name', 'created_by', 'updated_by'].includes(key)) {
          return typeof document[key] === 'string' && document[key].toLowerCase().includes(searchQuery.toLowerCase());
        }
        return false;
      })
    );
    setFilteredDocuments(filtered);
  }, [searchQuery, documents]);
  
  


  return (
    <>
    <div className="bg-[#F8F9FA] min-h-screen overflow-hidden">
      <Header />
      <ToastContainer />
      <div className="flex">
        <SideBar /> {/* Render SideBar component */}
        <div className="flex-grow p-12 py-0 mt-2 ml-52 max-h-[85vh] overflow-hidden">
          <div className="mx-auto w-full bg-white p-8 rounded-2xl">
            <div className='flex justify-between'>
            {permissions.includes('create_document') && (
              <button
                type="button"
                className="hover:shadow-form rounded-md bg-blue-600 py-1.5 h-[38px]  px-5 mb-5 text-center text-base font-semibold text-white outline-none"
                onClick={handleAdd}
              >
                <i className="fa-solid fa-circle-plus mr-2"></i>Add New Document
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
            {permissions.includes('view_document') && (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-blue-600">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider whitespace-nowrap">SR NO.</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider whitespace-nowrap">Document</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Created By</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Updated By</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Active</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                {filteredDocuments.map((document,index) => (
                    <tr key={document.document_id}>
                      <td className="px-6 py-4 whitespace-nowrap">{index + 1 + (currentPage - 1) * itemsPerPage}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{document.document_name}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{document.created_by}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{document.updated_by}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{document.is_deleted ? 'False' : 'True'}</td>
                      <td className="px-6 py-3 whitespace-nowrap">
                      {permissions.includes('update_document') && (
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
                       {permissions.includes('delete_document') && (
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
           {permissions.includes('view_document') && (
           <nav className="flex items-center justify-between mt-4">
            <div>
              <span className="text-sm font-normal text-gray-500">
                Showing <span className="font-semibold">{Math.min(indexOfFirstItem + 1, documents.length)}</span>-
                <span className="font-semibold">{Math.min(indexOfLastItem, documents.length)}</span> of{' '}
                <span className="font-semibold">{documents.length}</span>&nbsp;entries
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
                {Array.from({ length: Math.ceil(documents.length / itemsPerPage) }, (_, index) => (
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
                    disabled={currentPage === Math.ceil(documents.length / itemsPerPage)}
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
  {/* Add Document Modal */}
  {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-auto bg-gray-900 bg-opacity-50 flex items-center justify-center">

          <div className="bg-white p-8 w-96 rounded-lg">
            <div className="flex justify-between items-center mt-0">
            <h2 className="text-lg font-semibold mb-4">Add New Document</h2>
            <i className="fas fa-times -mr-4 -mt-16"  onClick={handleCloseModal} ></i>
            </div>
            <form onSubmit={handleSubmit}>
             
              <label htmlFor="website-admin" className="mb-2  block text-base font-medium text-[#07074D]">Document</label>
            <div className="flex mb-4">
                <span className="inline-flex items-center px-3 text-sm text-gray-900 bg-gray-200 border border-e-0 border-gray-300 rounded-s-md dark:bg-gray-600 dark:text-gray-400 dark:border-gray-600">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
                    <path fillRule="evenodd" d="M7.502 6h7.128A3.375 3.375 0 0 1 18 9.375v9.375a3 3 0 0 0 3-3V6.108c0-1.505-1.125-2.811-2.664-2.94a48.972 48.972 0 0 0-.673-.05A3 3 0 0 0 15 1.5h-1.5a3 3 0 0 0-2.663 1.618c-.225.015-.45.032-.673.05C8.662 3.295 7.554 4.542 7.502 6ZM13.5 3A1.5 1.5 0 0 0 12 4.5h4.5A1.5 1.5 0 0 0 15 3h-1.5Z" clipRule="evenodd" />
                    <path fillRule="evenodd" d="M3 9.375C3 8.339 3.84 7.5 4.875 7.5h9.75c1.036 0 1.875.84 1.875 1.875v11.25c0 1.035-.84 1.875-1.875 1.875h-9.75A1.875 1.875 0 0 1 3 20.625V9.375ZM6 12a.75.75 0 0 1 .75-.75h.008a.75.75 0 0 1 .75.75v.008a.75.75 0 0 1-.75.75H6.75a.75.75 0 0 1-.75-.75V12Zm2.25 0a.75.75 0 0 1 .75-.75h3.75a.75.75 0 0 1 0 1.5H9a.75.75 0 0 1-.75-.75ZM6 15a.75.75 0 0 1 .75-.75h.008a.75.75 0 0 1 .75.75v.008a.75.75 0 0 1-.75.75H6.75a.75.75 0 0 1-.75-.75V15Zm2.25 0a.75.75 0 0 1 .75-.75h3.75a.75.75 0 0 1 0 1.5H9a.75.75 0 0 1-.75-.75ZM6 18a.75.75 0 0 1 .75-.75h.008a.75.75 0 0 1 .75.75v.008a.75.75 0 0 1-.75.75H6.75a.75.75 0 0 1-.75-.75V18Zm2.25 0a.75.75 0 0 1 .75-.75h3.75a.75.75 0 0 1 0 1.5H9a.75.75 0 0 1-.75-.75Z" clipRule="evenodd" />
                </svg>


            </span>
            <input type="text"  className="flex-1 min-w-0 w-full text-sm p-2.5 rounded-md border mb-0 bg-white py-3 px-2 font-medium text-[#6B7280] outline-none focus:border-blue-600 focus:shadow-md" 
            placeholder="Enter Document Name"  id="document_name"
                name="document_name"
                value={formData.document_name}
                onChange={handleChange}   />
                </div>
                {errors.document_name && <p className="text-red-500 text-xs mt-0">{errors.document_name}</p>}
              <div className="flex justify-around mt-10">
               
              
                <button
                type="button"
                className="hover:shadow-form rounded-md bg-blue-600 py-1.5 h-[38px]  px-5  text-center text-base font-semibold text-white outline-none"
                onClick={handleCloseModal} >
              
                    <i className="fas fa-times mr-2"></i>
                         Cancel
                </button>

           
                <button
                type="button"
                className="hover:shadow-form rounded-md bg-blue-600 py-1.5 h-[38px]  px-5  text-center text-base font-semibold text-white outline-none"
              onClick={handleSubmit} 
            >
              
              <i className="fas fa-check mr-2"></i>  
              Submit
              </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Edit Document Modal */}
      {isUpdateModalOpen && (
        <div className="fixed inset-0 z-50 overflow-auto bg-gray-900 bg-opacity-50 flex items-center justify-center">

          <div className="bg-white p-8 w-96 rounded-lg">
<div className="flex justify-between items-center mt-0">
            <h2 className="text-lg font-semibold mb-4">Update Document</h2>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6 -mr-4 -mt-14" onClick={handleModalCloseAndReset}     >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg> 
</div>
            <form onSubmit={handleUpdate}>
             
              <label htmlFor="website-admin" className="mb-2  block text-base font-medium text-[#07074D]">Document</label>
                <div className="flex mb-4">
                    <span className="inline-flex items-center px-3 text-sm text-gray-900 bg-gray-200 border border-e-0 border-gray-300 rounded-s-md dark:bg-gray-600 dark:text-gray-400 dark:border-gray-600">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
                    <path fillRule="evenodd" d="M7.502 6h7.128A3.375 3.375 0 0 1 18 9.375v9.375a3 3 0 0 0 3-3V6.108c0-1.505-1.125-2.811-2.664-2.94a48.972 48.972 0 0 0-.673-.05A3 3 0 0 0 15 1.5h-1.5a3 3 0 0 0-2.663 1.618c-.225.015-.45.032-.673.05C8.662 3.295 7.554 4.542 7.502 6ZM13.5 3A1.5 1.5 0 0 0 12 4.5h4.5A1.5 1.5 0 0 0 15 3h-1.5Z" clipRule="evenodd" />
                    <path fillRule="evenodd" d="M3 9.375C3 8.339 3.84 7.5 4.875 7.5h9.75c1.036 0 1.875.84 1.875 1.875v11.25c0 1.035-.84 1.875-1.875 1.875h-9.75A1.875 1.875 0 0 1 3 20.625V9.375ZM6 12a.75.75 0 0 1 .75-.75h.008a.75.75 0 0 1 .75.75v.008a.75.75 0 0 1-.75.75H6.75a.75.75 0 0 1-.75-.75V12Zm2.25 0a.75.75 0 0 1 .75-.75h3.75a.75.75 0 0 1 0 1.5H9a.75.75 0 0 1-.75-.75ZM6 15a.75.75 0 0 1 .75-.75h.008a.75.75 0 0 1 .75.75v.008a.75.75 0 0 1-.75.75H6.75a.75.75 0 0 1-.75-.75V15Zm2.25 0a.75.75 0 0 1 .75-.75h3.75a.75.75 0 0 1 0 1.5H9a.75.75 0 0 1-.75-.75ZM6 18a.75.75 0 0 1 .75-.75h.008a.75.75 0 0 1 .75.75v.008a.75.75 0 0 1-.75.75H6.75a.75.75 0 0 1-.75-.75V18Zm2.25 0a.75.75 0 0 1 .75-.75h3.75a.75.75 0 0 1 0 1.5H9a.75.75 0 0 1-.75-.75Z" clipRule="evenodd" />
                </svg>

                    </span>
                    <input type="text"  className="flex-1 min-w-0 w-full text-sm p-2.5 rounded-md border mb-0 bg-white py-3 px-2 font-medium text-[#6B7280] outline-none focus:border-blue-600 focus:shadow-md" 
                      id="document_name"
                                    name="document_name"
                                    value={formData.document_name}
                                    onChange={handleChange}   />
                </div>
                {errors.document_name && <p className="text-red-500 text-xs mt-0">{errors.document_name}</p>}
                            <div className="flex justify-around mt-10">
                            
                            
                    <button
                type="button"
                className="hover:shadow-form rounded-md bg-blue-600 py-1.5 h-[38px]  px-5  text-center text-base font-semibold text-white outline-none"
                onClick={handleModalCloseAndReset}     >
              
                                    <i className="fas fa-times mr-2"></i>
                                   Cancel
              </button>

           
                    <button
                type="submit"
                className="hover:shadow-form rounded-md bg-blue-600 py-1.5 h-[38px]  px-5  text-center text-base font-semibold text-white outline-none"
            >
              
              <i className="fas fa-check mr-2"></i>  
              Submit
              </button>
              </div>
            </form>
          </div>
        </div>
      )}
</div></div></div></div></>
);
};

export default ViewDocument