
"use client"
import React, { useEffect, useState } from 'react'
import Header from '../../components/Header'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';import SideBar from '../../components/SideBar'
import Link from 'next/link'
import { deleteEnquiry, FetchEnquiryStatus } from '../../apiService'
import { ViewEnquiryData, viewEnquiry, updateEnquiry, fetchEnquiryStatus } from '../../apiService'
import { usePermissions } from '../../context/PermissionContext';
import { redirect } from 'next/navigation';


const ViewEnquiry = () => {

  useEffect(() => {
    const sessionEmail = localStorage.getItem('sessionEmail');
    if (!sessionEmail) {
      redirect('/UserLogin'); // Redirect to a 404 page or your desired route
    }
  }, []);
  
  const { permissions } = usePermissions();

  const [enquiries, setEnquiries] = useState<ViewEnquiryData[]>([]);

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10); // Number of items per page

  const [selectedEnquiry, setSelectedEnquiry] = useState<ViewEnquiryData | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [statuses, setStatuses] = useState<FetchEnquiryStatus[]>([]); // Specify the type here
  const [newStatus, setNewStatus] = useState('');
  const [openDropdown, setOpenDropdown] = useState(false);

  const [searchQuery, setSearchQuery] = useState(''); // Search query state
  const [filteredEnquiries, setFilteredEnquiries] = useState<ViewEnquiryData[]>([]); // Filtered customers state


  const toggleDropdown = () => {
    setOpenDropdown(!openDropdown);
  };

  // Calculate pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = enquiries.slice(indexOfFirstItem, indexOfLastItem);

  // Change page
  const paginate = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  useEffect(() => {
    const fetchEnquiries = async () => {
      try {
        const enquiriesData = await viewEnquiry();
        setEnquiries(enquiriesData);
        setFilteredEnquiries(enquiriesData); // Initialize filtered enquiries
      } catch (error) {
        console.error('Error fetching enquiries:', error);
      }
    };

    const fetchStatuses = async () => {
      try {
        const statusData = await fetchEnquiryStatus();
        setStatuses(statusData);
      } catch (error) {
        console.error('Error fetching enquiry statuses:', error);
      }
    };

    fetchEnquiries();
    fetchStatuses();
  }, []);

  const handleView = (enquiry: ViewEnquiryData) => {
    setSelectedEnquiry(enquiry);
    setIsModalOpen(true);
  };

  const handleEdit = (enquiry: ViewEnquiryData) => {
    setSelectedEnquiry(enquiry);
    setIsUpdateModalOpen(true);
    setIsModalOpen(false); // Close view modal if open
    setNewStatus(enquiry.enquiry_status); // Set current status
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setIsUpdateModalOpen(false);
    setSelectedEnquiry(null);
  };

  const handleUpdate = async () => {
    if (!selectedEnquiry || !newStatus) {
      toast.error('Please select a status');
      return;
    }
  
    try {
      await updateEnquiry({ enquiry_id: selectedEnquiry.enquiry_id, new_status: newStatus });
      toast.success('Enquiry status updated successfully');
      closeModal(); // Close modal after updating
      setEnquiries((prev) =>
        prev.map((enquiry) =>
          enquiry.enquiry_id === selectedEnquiry.enquiry_id ? { ...enquiry, enquiry_status: newStatus } : enquiry
        )
      );
    } catch (error) {
      toast.error('Failed to update enquiry status');
      console.error('Error updating enquiry:', error);
    }
  };
  

  const handleDelete = async (enquiryId: number) => {
    console.log('Deleting enquiry with ID:', enquiryId);
    try {
      await deleteEnquiry(enquiryId);
      setEnquiries((prevEnquiries) =>
        prevEnquiries.filter((enquiry) => enquiry.enquiry_id !== enquiryId)
      );
      toast.success('Enquiry deleted successfully');
    } catch (error) {
      toast.error('Failed to delete enquiry');
      console.error('Failed to delete enquiry:', error);
    }
  };
  
  useEffect(() => {
    const filtered = enquiries.filter(enquiry =>
      Object.keys(enquiry).some(key => {
        if (key === 'created_at') {
          // Format the date to a string that matches the search format
          const dateStr = new Date(enquiry[key]).toLocaleDateString('en-GB', { year: 'numeric', month: '2-digit', day: '2-digit' });
          return dateStr.includes(searchQuery);
        } else if (['customer_name', 'enquiry_status'].includes(key)) {
          return typeof enquiry[key] === 'string' && enquiry[key].toLowerCase().includes(searchQuery.toLowerCase());
        }
        return false;
      })
    );
    setFilteredEnquiries(filtered);
  }, [searchQuery, enquiries]);
  

  return (
    <div className="bg-[#F8F9FA] min-h-screen overflow-hidden">
    <Header />
    <ToastContainer />
    <div className="flex">
      <SideBar/>
      <div className="flex-grow p-12 py-0 mt-2 ml-52 h-full overflow-x-hidden">
        <div className="mx-auto w-full  bg-white p-8 rounded-2xl min-h-[85vh]">

        <div className='flex justify-between'>
        {permissions.includes('create_enquiry') && (

        <button
          type="button"
          className="hover:shadow-form rounded-md bg-blue-600 py-1.5 h-[38px] px-5 mb-5 text-center text-base font-semibold text-white outline-none"
        >
          <Link href="/AddEnquiry" passHref>
            
              <i className="fa-solid fa-circle-plus mr-2"></i>Add New Enquiry
          
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
            {permissions.includes('view_enquiry') && (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-blue-600">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider whitespace-nowrap">Sr. No</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider whitespace-nowrap">Customer Name</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Enquiry Status</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Enquiry Date</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">&nbsp;&nbsp;&nbsp;Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredEnquiries.map((enquiry, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap">{index + 1}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{enquiry.customer_name}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{enquiry.enquiry_status}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{new Date(enquiry.created_at).toLocaleDateString('en-GB', { year: 'numeric', month: '2-digit', day: '2-digit' })}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex space-x-2">
                      <div className="tooltip" data-tip="View">
                            <a
                              className="flex items-center rounded-md px-2 py-0 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                              onClick={() => handleView(enquiry)} // handle view icon click
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                                <path d="M11.625 16.5a1.875 1.875 0 1 0 0-3.75 1.875 1.875 0 0 0 0 3.75Z" />
                                <path fillRule="evenodd" d="M5.625 1.5H9a3.75 3.75 0 0 1 3.75 3.75v1.875c0 1.036.84 1.875 1.875 1.875H16.5a3.75 3.75 0 0 1 3.75 3.75v7.875c0 1.035-.84 1.875-1.875 1.875H5.625a1.875 1.875 0 0 1-1.875-1.875V3.375c0-1.036.84-1.875 1.875-1.875Zm6 16.5c.66 0 1.277-.19 1.797-.518l1.048 1.048a.75.75 0 0 0 1.06-1.06l-1.047-1.048A3.375 3.375 0 1 0 11.625 18Z" clipRule="evenodd" />
                                <path d="M14.25 5.25a5.23 5.23 0 0 0-1.279-3.434 9.768 9.768 0 0 1 6.963 6.963A5.23 5.23 0 0 0 16.5 7.5h-1.875a.375.375 0 0 1-.375-.375V5.25Z" />
                              </svg>
                            </a>
                          </div>
                          {permissions.includes('update_enquiry') && (
                            <div className="tooltip" data-tip="Edit">
                              <a
                                className="flex items-center rounded-md px-2 py-0 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                                onClick={() => handleEdit(enquiry)}// replace with your edit handler
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                                  <path d="M21.731 2.269a2.625 2.625 0 0 0-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 0 0 0-3.712ZM19.513 8.199l-3.712-3.712-8.4 8.4a5.25 5.25 0 0 0-1.32 2.214l-.8 2.685a.75.75 0 0 0 .933.933l2.685-.8a5.25 5.25 0 0 0 2.214-1.32l8.4-8.4Z" />
                                  <path d="M5.25 5.25a3 3 0 0 0-3 3v10.5a3 3 0 0 0 3 3h10.5a3 3 0 0 0 3-3V13.5a.75.75 0 0 0-1.5 0v5.25a1.5 1.5 0 0 1-1.5 1.5H5.25a1.5 1.5 0 0 1-1.5-1.5V8.25a1.5 1.5 0 0 1 1.5-1.5h5.25a.75.75 0 0 0 0-1.5H5.25Z" />
                                </svg>
                              </a>
                            </div>
                          )}
                          {permissions.includes('delete_enquiry') && (
                            <div className="tooltip" data-tip="Delete">
                              <a
                                className="flex items-center rounded-md px-2 py-0 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                                onClick={() => handleDelete(enquiry.enquiry_id)} // replace with your delete handler
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
            {permissions.includes('view_enquiry') && (
            <nav className="flex items-center justify-between mt-4">
          <div>
            <span className="text-sm font-normal text-gray-500">
              Showing <span className="font-semibold">{Math.min(indexOfFirstItem + 1, enquiries.length)}</span>-
              <span className="font-semibold">{Math.min(indexOfLastItem, enquiries.length)}</span> of{' '}
              <span className="font-semibold">{enquiries.length}</span>&nbsp;entries
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
              {Array.from({ length: Math.ceil(enquiries.length / itemsPerPage) }, (_, index) => (
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
                  disabled={currentPage === Math.ceil(enquiries.length / itemsPerPage)}
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

{/* Enquiry Modal */}
{isModalOpen && selectedEnquiry && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-800 bg-opacity-50">
    <div className="relative bg-white p-8 rounded-2xl shadow-lg w-full max-w-4xl">
      <button
        className="absolute top-2 right-2 text-gray-600 hover:text-gray-900"
        onClick={closeModal}
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
      <h2 className="text-2xl font-bold mb-6 font-merriweather">Enquiry Details</h2>

      {/* Row with Customer Name, Enquiry Status, and Enquiry Date */}
      <div className="grid grid-cols-3 gap-4 mb-4">
        <div className="bg-[#F8F9FA] p-4 rounded-lg shadow">
          <p className="text-blue-600 font-semibold mb-2">Customer Name</p>
          <p>{selectedEnquiry.customer_name}</p>
        </div>

        <div className="bg-[#F8F9FA] p-4 rounded-lg shadow">
          <p className="text-blue-600 font-semibold mb-2">Enquiry Status</p>
          <p>{selectedEnquiry.enquiry_status}</p>
        </div>

        <div className="bg-[#F8F9FA] p-4 rounded-lg shadow">
          <p className="text-blue-600 font-semibold mb-2">Enquiry Date</p>
          <p>{new Date(selectedEnquiry.created_at).toLocaleDateString()}</p>
        </div>
      </div>

    {/* Work Enquiry Details in Cards */}
<div className="bg-[#F8F9FA] p-4 rounded-lg shadow mb-4">
  <p className="text-blue-600 font-semibold mb-2">Work Enquiry</p>
  <div className="max-h-[15rem] overflow-y-auto">
    <div className="flex flex-wrap">
      {selectedEnquiry.work_enquiry.map((work, idx) => (
        <div key={idx} className="bg-white p-4 rounded-lg shadow flex-1 min-w-[200px] m-2">
          <p className="mb-2"><strong>Work Master:</strong> {work.work_master}</p>
          <p className="mb-2"><strong>Work Document:</strong></p>
          {Array.isArray(work.work_document) && work.work_document.length > 0 ? (
            <ul className="list-disc ml-6 mb-2">
              {work.work_document.map((doc, docIdx) => (
                <li key={docIdx}>{doc}</li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-600">No documents available</p>
          )}
          <p><strong>Work Cost:</strong> {work.work_cost}</p>
        </div>
      ))}
    </div>
  </div>
</div>




    </div>
  </div>
)}


{isUpdateModalOpen && (
  <div className="fixed inset-0 z-50 overflow-auto bg-gray-900 bg-opacity-50 flex items-center justify-center">
    <div className="bg-white p-8 w-96 rounded-lg shadow-lg">
      <div className="flex justify-between items-center mt-0">
        <h2 className="text-lg font-semibold mb-4">Update Enquiry Status</h2>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          className="w-6 h-6 -mr-4 -mt-14"
          onClick={closeModal}
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </div>

      <div className="mb-4">
        <label htmlFor="status-select" className="mb-2 block text-base font-medium text-[#07074D]">Select Status:</label>
        <div className="flex mb-4 relative">
          <span className="inline-flex items-center px-3 text-sm text-gray-900 bg-gray-200 border border-e-0 border-gray-300 rounded-s-md">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25ZM6.75 12h.008v.008H6.75V12Zm0 3h.008v.008H6.75V15Zm0 3h.008v.008H6.75V18Z" />
</svg>

          </span>
          <button
            id="dropdownBgHoverButton"
            className="flex-1 min-w-0 w-full text-sm p-2.5 rounded-md border mb-0 bg-white py-3 px-2 font-medium text-[#6B7280] outline-none focus:border-blue-600 focus:shadow-md dropdown-button"
            type="button"
            onClick={toggleDropdown}
          >
            <span className='flex justify-between'>
              {newStatus || "Select a status"} 
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
                <path fillRule="evenodd" d="M12.53 16.28a.75.75 0 0 1-1.06 0l-7.5-7.5a.75.75 0 0 1 1.06-1.06L12 14.69l6.97-6.97a.75.75 0 1 1 1.06 1.06l-7.5 7.5Z" clipRule="evenodd" />
              </svg>
            </span>
          </button>

          {openDropdown && (
            <div id="dropdownBgHover" className="ml-12 z-10 absolute top-full mt-2 w-48 bg-white rounded-lg shadow dark:bg-gray-700 dropdown-menu max-h-48 overflow-y-auto">
              <ul className="p-3 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="dropdownBgHoverButton">
                {statuses.map((status, index) => (
                  <li
                    key={index}
                    className={`cursor-pointer select-none relative py-2 px-4 ${newStatus === status.status ? 'bg-[#F8F9FA]' : 'hover:bg-[#F8F9FA]'}`}
                    onClick={() => setNewStatus(status.status)}
                  >
                    {status.status}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-around mt-10">
        <button
          onClick={closeModal}
          className="hover:shadow-form rounded-md bg-blue-600 py-1.5 h-[38px] px-5 text-center text-base font-semibold text-white outline-none"
        >
          <i className="fas fa-times mr-2"></i>
          Cancel
        </button>
        <button
          onClick={handleUpdate}
          className="hover:shadow-form rounded-md bg-blue-600 py-1.5 h-[38px] px-5 text-center text-base font-semibold text-white outline-none"
        >
          <i className="fas fa-check mr-2"></i>
          Submit
        </button>
      </div>
    </div>
  </div>
)}


            
            </div></div></div></div>
  )
}

export default ViewEnquiry