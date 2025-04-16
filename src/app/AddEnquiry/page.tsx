"use client";
import React, { useState, useEffect } from 'react';
import Header from '../../components/Header';
import SideBar from '../../components/SideBar'; // Ensure correct path to SideBar
import { viewWorkMaster, viewDocuments, ViewWorkMasterData, ViewDocumentData, FetchCustomerData, fetchCustomer, EnquiryData, addEnquiry } from '../../apiService';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Link from 'next/link';
import { faEnvelope, faUser } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { redirect } from 'next/navigation'


const AddEnquiry = () => {

  useEffect(() => {
    const sessionEmail = localStorage.getItem('sessionEmail');
    if (!sessionEmail) {
      redirect('/UserLogin'); // Redirect to a 404 page or your desired route
    }
  }, []);
  
  const [works, setWorks] = useState<ViewWorkMasterData[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(6); // Number of items per page
  const [selectedDocuments, setSelectedDocuments] = useState<string[]>([]);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [documents, setDocuments] = useState<ViewDocumentData[]>([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const [formData, setFormData] = useState({
    email_mobile: '',
    first_name: '',
    last_name: '',
    customer_id: '', // Add customer_id to formData
    work_master: [] as string[], // Initialize as an empty array
  });

  const [errors, setErrors] = useState({
    email_mobile: '',
    first_name: '',
    last_name: '',
    work_master: ''
  });

  // Fetch work master data on component mount
  useEffect(() => {
    const fetchWorkMaster = async () => {
      try {
        const workMasterData = await viewWorkMaster();
        setWorks(workMasterData);
      } catch (error) {
        console.error('Error fetching work master:', error);
      }
    };
    fetchWorkMaster();
  }, []);

  // Fetch document master data on component mount
  useEffect(() => {
    const fetchDocumentMaster = async () => {
      try {
        const documentMasterData = await viewDocuments();
        setDocuments(documentMasterData);
      } catch (error) {
        console.error('Error fetching documents:', error);
      }
    };
    fetchDocumentMaster();
  }, []);

  

  // Filter works based on selected work_master
  const filteredWorks = formData.work_master.length > 0
    ? works.filter(work => formData.work_master.includes(work.work_master))
    : [];

  // Calculate pagination based on filtered works
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredWorks.slice(indexOfFirstItem, indexOfLastItem);

  // Change page
  const paginate = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const handleViewDocuments = (documents: string[]) => {
    setSelectedDocuments(documents);
    setIsViewModalOpen(true);
  };

  const handleClosePopUpModal = () => {
    setIsViewModalOpen(false);
  };

  const resetForm = () => {
    setFormData({
      email_mobile: '',
      first_name: '',
      last_name: '',
      customer_id: '', // Add customer_id to formData
      work_master: [],
    });
    setErrors({
      email_mobile: '',
      first_name: '',
      last_name: '',
      work_master: ''
    });
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleWorkMasterSelect = (workMaster: string) => {
    const isSelected = formData.work_master.includes(workMaster);

    if (isSelected) {
      // If already selected, remove from array
      setFormData({
        ...formData,
        work_master: formData.work_master.filter((item) => item !== workMaster),
      });
    } else {
      // If not selected, add to array
      setFormData({
        ...formData,
        work_master: [...formData.work_master, workMaster],
      });
    }

    setIsDropdownOpen(false); // Close dropdown after selection

  };

  // Fetch customer data when email_mobile changes
  const fetchCustomerData = async (emailMobile: string) => {
    try {
      const customer: FetchCustomerData = await fetchCustomer(emailMobile);
      setFormData((prevFormData) => ({
        ...prevFormData,
        first_name: customer.first_name,
        last_name: customer.last_name,
        customer_id: customer.customer_id, // Add customer_id here
      }));
      setErrors((prevErrors) => ({
        ...prevErrors,
        email_mobile: '',
      }));
    } catch (error) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        email_mobile: 'Customer not found',
      }));
      setFormData((prevFormData) => ({
        ...prevFormData,
        first_name: '',
        last_name: '',
        customer_id: '', // Reset customer_id on error
      }));

      // Display toast message for "Customer not found"
      toast.error('Customer not found.');
    }
  };

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  
    // Validate email/mobile
    if (name === 'email_mobile') {
      if (value.trim() === '') {
        setErrors((prevErrors) => ({
          ...prevErrors,
          email_mobile: 'Email/Mobile is required',
        }));
      } else {
        setErrors((prevErrors) => ({
          ...prevErrors,
          email_mobile: '',
        }));
  
        // Check if it's a valid email format
        const basicEmailRegex = /^[\w-]+(?:\.[\w-]+)*@(?:[\w-]+\.)+[a-zA-Z]{2,7}$/;
        if (basicEmailRegex.test(value)) {
          // Check if the domain suffix is partially entered
          const commonDomainSuffixes = /\.(com|net|org|edu|gov|mil)$/i;
          if (commonDomainSuffixes.test(value)) {
            try {
              await fetchCustomerData(value);
            } catch (error) {
              console.error('Error fetching customer data:', error);
              setErrors((prevErrors) => ({
                ...prevErrors,
                email_mobile: 'Customer not found',
              }));
            }
          } else {
            setErrors((prevErrors) => ({
              ...prevErrors,
              email_mobile: 'Please complete the email address',
            }));
          }
        } else if (value.match(/^\d{10}$/)) {
          // Mobile number format (assuming 10 digits)
          try {
            await fetchCustomerData(value);
          } catch (error) {
            console.error('Error fetching customer data:', error);
            setErrors((prevErrors) => ({
              ...prevErrors,
              email_mobile: 'Customer not found',
            }));
          }
        } else {
          setErrors((prevErrors) => ({
            ...prevErrors,
            email_mobile: 'Invalid email/mobile format',
          }));
        }
      }
    }
  };
  
  
  

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const workEnquiryData = formData.work_master.map((workMaster) => {
        const selectedWork = works.find((work) => work.work_master === workMaster);
        return selectedWork ? selectedWork.work_master_id : null;
      }).filter(id => id !== null);

      const enquiryData: EnquiryData = {
        customer_id: formData.customer_id, // Use customer_id from formData
        work_enquiry: workEnquiryData,
      };

      await addEnquiry(enquiryData);

      toast.success('Enquiry added successfully');
      resetForm();
      // Redirect after 5 seconds
      setTimeout(() => {
        window.location.href = '/ViewEnquiry';
      }, 3000);
    } catch (error) {
      console.error('Error adding enquiry:', error);
      toast.error('Failed to add enquiry');
    }
  }; 

  return (
    <div className="bg-[#F8F9FA] min-h-screen overflow-hidden">
      <Header />
      <ToastContainer />
      <div className="flex">
        <SideBar />
        <div className="flex-grow p-12 py-0 mt-2 ml-52 h-full overflow-x-hidden">
          <div className="mx-auto w-full bg-white p-8 rounded-2xl min-h-[85vh]">
            <form onSubmit={handleSubmit} className="font-roboto">
              <div className="flex mb-4 space-x-4">
                <div className="w-full">
                <label htmlFor="email_mobile" className="mb-2 block text-base font-medium text-[#07074D]">
    Email / Mobile
  </label>
  <div className="flex">
    <span className="inline-flex items-center px-3 text-lg text-gray-900 bg-gray-200 border border-e-0 border-gray-300 rounded-s-md dark:bg-gray-600 dark:text-gray-400 dark:border-gray-600">
      <FontAwesomeIcon icon={faEnvelope} />
    </span>
    <input
      type="text"
      name="email_mobile"
      id="email_mobile"
      placeholder="Enter Email / Mobile"
      value={formData.email_mobile}
      onChange={handleChange}
      className="flex-1 min-w-0 w-full text-sm p-2.5 rounded-md border mb-0 border-[#e0e0e0] bg-white py-3 px-2 font-medium text-[#6B7280] outline-none focus:border-blue-600 focus:shadow-md"
    />
  </div>
</div>

<div className="w-full mb-4">
  <label htmlFor="first_name" className="mb-2 block text-base font-medium text-[#07074D]">
    First Name
  </label>
  <div className="flex">
    <span className="inline-flex items-center px-3 text-lg text-gray-900 bg-gray-200 border border-e-0 border-gray-300 rounded-s-md dark:bg-gray-600 dark:text-gray-400 dark:border-gray-600">
      <FontAwesomeIcon icon={faUser} />
    </span>
    <input
      type="text"
      name="first_name"
      id="first_name"
      placeholder="First Name"
      value={formData.first_name}
      disabled
      className="flex-1 min-w-0 w-full text-sm p-2.5 rounded-md border mb-0 border-[#e0e0e0] bg-white py-3 px-2 font-medium text-[#6B7280] outline-none focus:border-blue-600 focus:shadow-md cursor-not-allowed"
    />
  </div>
</div>

<div className="w-full mb-4">
  <label htmlFor="last_name" className="mb-2 block text-base font-medium text-[#07074D]">
    Last Name
  </label>
  <div className="flex">
    <span className="inline-flex items-center px-3 text-lg text-gray-900 bg-gray-200 border border-e-0 border-gray-300 rounded-s-md dark:bg-gray-600 dark:text-gray-400 dark:border-gray-600">
      <FontAwesomeIcon icon={faUser} />
    </span>
    <input
      type="text"
      name="last_name"
      id="last_name"
      placeholder="Last Name"
      value={formData.last_name}
      disabled
      className="flex-1 min-w-0 w-full text-sm p-2.5 rounded-md border mb-0 border-[#e0e0e0] bg-white py-3 px-2 font-medium text-[#6B7280] outline-none focus:border-blue-600 focus:shadow-md cursor-not-allowed"
    />
  </div>
</div></div>
        <label htmlFor="work_document" className="mb-2 block text-base font-medium text-[#07074D]">Work</label>
<div className="relative mb-4 flex max-w-96">
  <span className="inline-flex items-center px-3 text-sm text-gray-900 bg-gray-200 border border-e-0 border-gray-300 rounded-s-md dark:bg-gray-600 dark:text-gray-400 dark:border-gray-600">
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
      <path fillRule="evenodd" d="M5.625 1.5c-1.036 0-1.875.84-1.875 1.875v17.25c0 1.035.84 1.875 1.875 1.875h12.75c1.035 0 1.875-.84 1.875-1.875V12.75A3.75 3.75 0 0 0 16.5 9h-1.875a1.875 1.875 0 0 1-1.875-1.875V5.25A3.75 3.75 0 0 0 9 1.5H5.625ZM7.5 15a.75.75 0 0 1 .75-.75h7.5a.75.75 0 0 1 0 1.5h-7.5A.75.75 0 0 1 7.5 15Zm.75 2.25a.75.75 0 0 0 0 1.5H12a.75.75 0 0 0 0-1.5H8.25Z" clipRule="evenodd" />
      <path d="M12.971 1.816A5.23 5.23 0 0 1 14.25 5.25v1.875c0 .207.168.375.375.375H16.5a5.23 5.23 0 0 1 3.434 1.279 9.768 9.768 0 0 0-6.963-6.963Z" />
    </svg>
  </span>
  <button
    id="dropdownBgHoverButton"
    className="flex-1 min-w-0 w-full text-sm p-2.5 rounded-md border -mb-0 bg-white py-3 px-2 font-medium text-[#6B7280] outline-none focus:border-blue-600 focus:shadow-md relative z-10"
    type="button"
    onClick={toggleDropdown}
  >
    <span className="-ml-44">&nbsp;{formData.work_master.length} selected</span> {/* Display count of selected work masters */}
    <svg className="w-4 h-4 float-right mt-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
      <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 4 4 4-4" />
    </svg>
  </button>
  {isDropdownOpen && (
    <div className="absolute z-20 top-full left-0 w-full bg-white rounded-lg shadow mt-1">
      <ul className="p-3 space-y-1 text-sm text-gray-700" aria-labelledby="dropdownButton">
        {works.map((item, index) => (
          <li key={index}>
            <label className="flex items-center">
              <input
                type="checkbox"
                className="form-checkbox h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                checked={formData.work_master.includes(item.work_master)}
                onChange={() => handleWorkMasterSelect(item.work_master)}
              />
              <span className="ml-2 text-sm font-medium text-gray-900">{item.work_master}</span>
            </label>
          </li>
        ))}
      </ul>
    </div>
  )}
</div>

{errors.work_master && <p className="text-red-500 text-xs mt-0">{errors.work_master}</p>}
          
{/* Table */}
<div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-blue-600">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider whitespace-nowrap">Work Master</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider whitespace-nowrap">Work Documents</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Work Cost</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {currentItems.map((work, index) => (
              <tr key={work.work_master_id}>
                <td className="px-6 py-4 whitespace-nowrap">{work.work_master}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <button
                    type="button"
                    className="text-blue-600 underline"
                    onClick={() => handleViewDocuments(work.work_document)}
                  >
                    View Documents
                  </button>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">{work.work_cost}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
           {/* Pagination */}
           <nav className="flex items-center justify-between mt-4">
  <div>
    <span className="text-sm font-normal text-gray-500">
      Showing <span className="font-semibold">{Math.min(indexOfFirstItem + 1, filteredWorks.length)}</span>-
      <span className="font-semibold">{Math.min(indexOfLastItem, filteredWorks.length)}</span> of{' '}
      <span className="font-semibold">{filteredWorks.length}</span>&nbsp;entries
    </span>
  </div>
  <div>
    <ul className="flex items-center space-x-1 font-light">
      <li className="border border-gray-300 rounded-full text-gray-500 hover:bg-gray-200 hover:border-gray-200 bg-white">
        <button
          onClick={() => paginate(currentPage - 1)}
          className="w-8 h-8 flex items-center justify-center"
          disabled={currentPage === 1}
          type="button" // Ensure button type is explicitly set to 'button'
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
      {Array.from({ length: Math.ceil(filteredWorks.length / itemsPerPage) }, (_, index) => (
        <li
          key={index}
          className={`border border-gray-300  rounded-full text-gray-500  ${
            currentPage === index + 1 ? 'bg-blue-600 border-blue-600 text-white' : 'hover:bg-gray-200 hover:border-gray-200'
          }`}
        >
          <button
            onClick={() => paginate(index + 1)}
            className="w-8 h-8 flex items-center justify-center"
            type="button" // Ensure button type is explicitly set to 'button'
          >
            {index + 1}
          </button>
        </li>
      ))}
      <li className="border border-gray-300 rounded-full text-gray-500 hover:bg-gray-200 hover:border-gray-200 bg-white">
        <button
          onClick={() => paginate(currentPage + 1)}
          className="w-8 h-8 flex items-center justify-center"
          disabled={currentPage === Math.ceil(filteredWorks.length / itemsPerPage)}
          type="button" // Ensure button type is explicitly set to 'button'
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
{/* Document Popup */}
{isViewModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-800 bg-opacity-50">
          <div className="relative bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
            <button
              className="absolute top-2 right-2 text-gray-600 hover:text-gray-900"
              onClick={handleClosePopUpModal}
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
                <ul className="list-disc list-inside text-md mb-2.5 ml-4">
                  {selectedDocuments.map((doc, index) => (
                    <li key={index}>{doc}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Form buttons */}
      
      <div className="flex justify-center items-center font-roboto">
                <button type="submit" className="hover:shadow-form rounded-md bg-blue-600 py-3 px-5 mt-10 text-center text-base font-semibold text-white outline-none">
                  <i className="fas fa-check mr-2"></i>
                  Submit
                </button>
                <button type="reset" onClick={resetForm} className="hover:shadow-form rounded-md bg-blue-600 py-3 px-5 mt-10 ml-10 text-center text-base font-semibold text-white outline-none">
                  <i className="fas fa-redo mr-2"></i>
                  Reset
                </button>
                <Link href="/ViewEnquiry">
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

            
            </div></div></div></div>
  )
}

export default AddEnquiry