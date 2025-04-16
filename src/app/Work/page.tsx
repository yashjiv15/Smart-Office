"use client";

import React, { useState, useEffect, useRef } from "react";
import Header from "../../components/Header";
import { redirect } from "next/navigation";
import SideBar from "../../components/SideBar"; // Ensure correct path to SideBar
import {
  viewWork,
  ViewWorkData,
  viewUsers,
  UserData,
  assignWorkTask, AssignWorkTaskData,revokeWorkTask,RevokeWorkTaskData,updateWorkTask,UpdateWorkTaskData,
  StatusItem
} from "../../apiService";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { usePermissions } from '../../context/PermissionContext';


const Work = () => {
  useEffect(() => {
    const sessionEmail = localStorage.getItem('sessionEmail');
    if (!sessionEmail) {
      redirect('/UserLogin'); // Redirect to a 404 page or your desired route
    }
  }, []);

  const { permissions } = usePermissions();

  const [works, setWorks] = useState<ViewWorkData[]>([]);
  const [users, setUsers] = useState<UserData[]>([]);
  const [dropdownOpen, setDropdownOpen] = useState<{ [key: string]: boolean }>({});

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(7); // Number of items per page

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEnquiry, setSelectedEnquiry] = useState<ViewWorkData | null>(null);

  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [assignEnquiry, setAssignEnquiry] = useState<ViewWorkData | null>(null);

  const [activeDropdown, setActiveDropdown] = useState<number | null>(null);

  const [selectedEmployee, setSelectedEmployee] = useState<{ [key: number]: string }>({}); // Updated state type

  const [selectedStatus, setSelectedStatus] = useState<{ [key: number]: string }>({}); // Updated state type

  const [selectedDocuments, setSelectedDocuments] = useState<{ [key: number]: string[] }>({});

  const [workTasks, setWorkTasks] = useState<any[]>([]); // Define workTasks state

  const [searchQuery, setSearchQuery] = useState(''); // Search query state
  const [filteredWorks, setFilteredWorks] = useState<ViewWorkData[]>([]); // Filtered works state

  const handleEmployeeSelect = (index: number, employeeName: string) => {
    setSelectedEmployee((prevState) => ({
      ...prevState,
      [index]: employeeName,
    }));
    setDropdownOpen((prevState) => ({
      ...prevState,
      [index]: false,
    }));
  };

  const activeToggleDropdown = (index: number) => {
    setActiveDropdown(activeDropdown === index ? null : index);
  };

  // Function to handle status change
const handleStatusChange = (index: number, status: string) => {
  setSelectedStatus((prevState) => ({
    ...prevState,
    [index]: status,
  }));
  setDropdownOpen((prevState) => ({
    ...prevState,
    [index]: false,
  }));
};

useEffect(() => {
  // Initialize the selectedDocuments state with existing work_document_vs_customer_document values
  if (selectedEnquiry) {
    const initialSelectedDocuments = selectedEnquiry.work_details.reduce((acc, work, idx) => {
      acc[idx] = Array.isArray(work.work_document_vs_customer_document) ? work.work_document_vs_customer_document : [];
      return acc;
    }, {});
    setSelectedDocuments(initialSelectedDocuments);
  }
}, [selectedEnquiry]);

const handleDocumentChange = (index: number, document: string) => {
  setSelectedDocuments((prevState) => {
    const updatedDocuments = prevState[index] || [];
    if (updatedDocuments.includes(document)) {
      return {
        ...prevState,
        [index]: updatedDocuments.filter(doc => doc !== document),
      };
    } else {
      return {
        ...prevState,
        [index]: [...updatedDocuments, document],
      };
    }
  });
};


  const fetchUsers = async () => {
    try {
      const customersData = await viewUsers();
      setUsers(customersData);
    } catch (error) {
      console.error("Error fetching Employee:", error);
    }
  };
  useEffect(() => {
    fetchUsers();
  }, []);

  const WorkMaster = async () => {
    try {
      const workMasterData = await viewWork();
      setWorks(workMasterData);
      setFilteredWorks(workMasterData);
    } catch (error) {
      console.error("Error fetching roles:", error);
    }
  };
  useEffect(() => {
    WorkMaster();
  }, []);

  const toggleDropdown = (serialNo: number) => {
    setDropdownOpen((prevOpen) => ({
      ...prevOpen,
      [serialNo]: !prevOpen[serialNo],
    }));
  };

  // Calculate pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = works.slice(indexOfFirstItem, indexOfLastItem);

  // Change page
  const paginate = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  // Handle opening the details popup
  const handleViewDetails = (enquiry: ViewWorkData) => {
    setSelectedEnquiry(enquiry);
    setIsModalOpen(true);
  };

  // Handle closing the details popup
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedEnquiry(null);
  };

   // Handle opening the assign modal
   const handleOpenAssignModal = (enquiry: ViewWorkData) => {
    setAssignEnquiry(enquiry);
    setIsAssignModalOpen(true);

    // Initialize selectedEmployee state based on work details
    const initialSelectedEmployees = enquiry.work_details.reduce((acc, work, index) => {
      acc[index] = work.work_owner || 'Select Employee';
      return acc;
    }, {} as { [key: number]: string });

    setSelectedEmployee(initialSelectedEmployees);
  };

  // Handle closing the assign modal
  const handleCloseAssignModal = () => {
    setIsAssignModalOpen(false);
    setAssignEnquiry(null);
  };

  const handleAssignWorkTask = async (workId: string, workMaster: string, firstName: string, lastName: string) => {
    const assignWorkTaskData: AssignWorkTaskData = {
      work_id: workId,
      work_master: workMaster, // Send work_master instead of work_master_id
      first_name: firstName,
      last_name: lastName,
    };
  
    try {
      await assignWorkTask(assignWorkTaskData);
      toast.success('Work task assigned successfully');
      // Reload work tasks to reflect the change
      
      handleCloseAssignModal();
      setTimeout(() => {
        window.location.reload();
      }, 5000); // Reload after 3 seconds
     } catch (error: any) {
      toast.error(`Error assigning work task: ${error.message}`);
    }
  };

  // Update dropdown options to disable already assigned users
  const updateDropdownOptions = (workMaster: string) => {
    // Ensure workTasks and users are correctly populated
    return users.map(employee => ({
      ...employee,
      disabled: workTasks.some(task => 
        task.work_master === workMaster && 
        task.work_owner.current_owner.email === employee.email
      ),
    }));
  };
  
  const handleRevokeWorkTask = async (workId: string, workMaster: string) => {
    const revokeWorkTaskData: RevokeWorkTaskData = {
      work_id: workId,
      work_master: workMaster,
    };
  
    try {
      await revokeWorkTask(revokeWorkTaskData);
      toast.success('Work task revoked successfully');
      // Reload work tasks to reflect the change
      handleCloseAssignModal();
      setTimeout(() => {
        window.location.reload();
      }, 5000); // Reload after 3 seconds
    } catch (error: any) {
      toast.error(`Error revoking work task: ${error.message}`);
    }
  };

  const handleUpdateWorkTask = async (work_id: string, work_master: string, work_documents: string[], status: string) => {
    const updateWorkTaskData: UpdateWorkTaskData = {
      work_id,
      work_master, // Ensure this matches
      work_documents, // Ensure this is an array
      work_task_status: status,
    };
  
    try {
      await updateWorkTask(updateWorkTaskData);
      toast.success('Work task updated successfully');
      handleCloseModal();
      setTimeout(() => {
        window.location.reload();
      }, 3000); // Reload after 3 seconds
    } catch (error: any) {
      toast.error(`Error updating work task: ${error.message}`);
    }
  };
  
  
  useEffect(() => {
    const filtered = works.filter(work =>
      Object.keys(work).some(key =>
        ['work_id', 'enquiry_date', 'customer_name', 'work_status'].includes(key) &&
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
        <div className="flex-grow p-12 py-0 mt-2 ml-52  overflow-hidden">
          <div className="mx-auto w-full bg-white p-8 rounded-2xl">
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
              {permissions.includes('view_work_task') && (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-blue-600">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider whitespace-nowrap">Work ID</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider whitespace-nowrap">Enquiry Date</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider whitespace-nowrap">Customer Name</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider whitespace-nowrap">Task List</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Work Status</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                {filteredWorks.map((work, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap">{work.work_id}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{new Date(work.enquiry_date).toLocaleDateString('en-GB', { year: 'numeric', month: '2-digit', day: '2-digit' })}</td>                    
                      <td className="px-6 py-4 whitespace-nowrap">{work.customer_name}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          className="text-blue-600 underline"
                          onClick={() => handleViewDetails(work)}
                          >
                          View Task
                        </button>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">{work.work_status}</td>
                      <td  className="px-6 py-4 whitespace-nowrap">
                  <button
                    type="button"
                    className="hover:shadow-form rounded-md bg-blue-600  h-[38px] px-5  text-center text-base font-semibold text-white outline-none"
                    onClick={() => handleOpenAssignModal(work)}
                  >
                    <i className="fa-solid fa-circle-plus mr-2"></i> Assign Task
                  </button>
                  
                </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
              )}
            {/* Pagination */}
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
            {/* Enquiry Modal */}
            {isModalOpen && selectedEnquiry && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-800 bg-opacity-50">
    <div className="relative bg-white p-8 rounded-2xl shadow-lg w-full max-w-3xl">
      <button
        className="absolute top-2 right-2 text-gray-600 hover:text-gray-900"
        onClick={handleCloseModal}
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
      <h2 className="text-2xl font-bold mb-6 font-merriweather">Task Details</h2>

      {/* Row with Customer Name, Enquiry Status, and Enquiry Date */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="bg-[#F8F9FA] p-4 rounded-lg shadow">
          <p className="text-blue-600 font-semibold mb-2">Customer Name</p>
          <p>{selectedEnquiry.customer_name}</p>
        </div>
        
        <div className="bg-[#F8F9FA] p-4 rounded-lg shadow">
          <p className="text-blue-600 font-semibold mb-2">Work ID</p>
          <p>{selectedEnquiry.work_id}</p>
        </div>
      </div>

      {/* Work Enquiry Details in Cards */}
      <div className="bg-[#F8F9FA] p-4 rounded-lg shadow mb-4">
        <p className="text-blue-600 font-semibold mb-2">Work Task</p>
        <div className="max-h-[16rem] overflow-y-auto">
          <div className="flex flex-col gap-4">
          {selectedEnquiry.work_details.map((work, idx) => (
                  <div key={idx} className="bg-white p-4 rounded-lg shadow flex flex-col items-center mb-4">
                    <div className="w-full flex flex-col md:flex-row justify-between">
                      <div className="flex-1">
                        <p className="mb-2"><strong>Work Master:</strong> {work.work_master}</p>
                        <p className="mb-2"><strong>Work Document:</strong></p>
                        {Array.isArray(work.work_documents) && work.work_documents.length > 0 ? (
                          <ul className="list-none ml-5 mb-2">
                            {work.work_documents.map((doc, docIdx) => (
                              <li key={docIdx} className="flex items-center mb-2">
                                <input
                                  type="checkbox"
                                  className="mr-2"
                                  checked={
                                    (selectedDocuments[idx] || 
                                    (Array.isArray(work.work_document_vs_customer_document) ? work.work_document_vs_customer_document : [])).includes(doc)
                                  }
                                  onChange={() => handleDocumentChange(idx, doc)}
                                />
                                {doc}
                              </li>
                            ))}
                          </ul>
                    ) : (
                      <p className="text-gray-600">No documents available</p>
                    )}
                    <p><strong>Work Cost:</strong> {work.work_cost}</p>
                  </div>
                  <div className="ml-4 flex-shrink-0">
                    <p className="mb-2"><strong>Task Assigned To:</strong> {work.work_owner}</p>
                    <p className="mb-2">
  <strong>Task Assigned Time:</strong>
  {work.work_task_created_at ? (
    new Date(work.work_task_created_at).toLocaleString('en-IN', { 
      year: 'numeric', 
      month: '2-digit', 
      day: '2-digit', 
      hour: '2-digit', 
      minute: '2-digit', 
      hour12: true,
      timeZone: 'Asia/Kolkata' // Indian Standard Time
    })
  ) : (
    ' '
  )}
</p>
<p className="mb-2">
  <strong>Task Complete Time:</strong>
  {work.work_task_complete_time ? (
    new Date(work.work_task_complete_time).toLocaleString('en-IN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
      timeZone: 'Asia/Kolkata' // Indian Standard Time
    })
  ) : (
    ' '
  )}
</p>

                    {/* Task Details Section */}
                    <div className="relative flex items-center">
                      <strong>Task Status:</strong>
                      <button
        id={`dropdown-button-${idx}`}
        className="flex-1 min-w-0 w-full text-sm p-2.5 rounded-md border bg-white py-2 px-2 font-medium text-[#6B7280] outline-none focus:border-blue-600 focus:shadow-md ml-2"
        type="button"
        onClick={() => activeToggleDropdown(idx)}
      >
        <span className="flex justify-between">
          {selectedStatus[idx] || work.work_task_status || "Select task status"}
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
            <path fillRule="evenodd" d="M12.53 16.28a.75.75 0 0 1-1.06 0l-7.5-7.5a.75.75 0 0 1 1.06-1.06L12 14.69l6.97-6.97a.75.75 0 1 1 1.06 1.06l-7.5 7.5Z" clipRule="evenodd" />
          </svg>
        </span>
      </button>

      {activeDropdown === idx && work.status_list && (
        <div id={`dropdown-menu-${idx}`} className="absolute ml-28 top-full left-0 mt-2 w-48 bg-white rounded-lg shadow z-10">
          <ul className="p-3 text-sm text-gray-700" aria-labelledby={`dropdown-button-${idx}`}>
            {work.status_list.map((statusItem: StatusItem) => (
              <li
                key={statusItem.status_id}
                className={`cursor-pointer select-none relative py-2 px-2 ${selectedStatus[idx] === statusItem.status ? 'bg-[#F8F9FA]' : 'hover:bg-[#F8F9FA]'}`}
                onClick={() => handleStatusChange(idx, statusItem.status)}
              >
                {statusItem.status}
              </li>
            ))}
          </ul>
        </div>
      )}
                    </div>
                  </div>
                </div>
                <div className="flex justify-center mt-4 w-full">
                <button
  className="hover:shadow-form rounded-md bg-blue-600 py-1.5 h-[38px] w-1/2 px-5 text-center text-base font-semibold text-white outline-none"
  onClick={() => handleUpdateWorkTask(
    selectedEnquiry.work_id,
    work.work_master,
    selectedDocuments[idx] || [], // Pass the selected documents
    selectedStatus[idx]
  )}
>
  <i className="fas fa-check mr-2"></i>
  Update
</button>




                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  </div>
)}




{/* Modal for Assign Work */}
{isAssignModalOpen && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-800 bg-opacity-50">
    <div className="relative bg-white p-8 rounded-2xl shadow-lg w-full max-w-3xl">
      <button
        className="absolute top-2 right-2 text-gray-600 hover:text-gray-900"
        onClick={handleCloseAssignModal}
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
      <h2 className="text-2xl font-bold mb-6 font-merriweather">Assign Work</h2>
      
      {assignEnquiry && (
        <div>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="bg-[#F8F9FA] p-4 rounded-lg shadow">
              <p className="text-blue-600 font-semibold mb-2">Customer Name</p>
              <p>{assignEnquiry.customer_name}</p>
            </div>
            <div className="bg-[#F8F9FA] p-4 rounded-lg shadow">
              <p className="text-blue-600 font-semibold mb-2">Work ID</p>
              <p>{assignEnquiry.work_id}</p>
            </div>
          </div>
          <div className="bg-[#F8F9FA] p-4 rounded-lg shadow mb-4">
            <p className="text-blue-600 font-semibold mb-2">Work Masters</p>
            <div className="max-h-[16rem] overflow-y-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Work</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employee</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {assignEnquiry.work_details.map((work, idx) => (
                    
                    <tr key={idx}>
                      <td className="px-4 py-2">{work.work_master}</td>
                      <td className="px-4 py-2 relative">
                        <button
                          id={`dropdownToggle-${idx}`}
                          className="flex-1 min-w-0 w-[200px] text-sm p-2.5 rounded-md border mb-0 bg-white px-2 font-medium text-[#6B7280] outline-none focus:border-blue-600 focus:shadow-md dropdown-button"
                          type="button"
                          onClick={() => toggleDropdown(idx)}
                        >
                          <span className='flex justify-between'>    
                            {selectedEmployee[idx] || work.work_owner || 'Select Employee'}

                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
                            <path fillRule="evenodd" d="M12.53 16.28a.75.75 0 0 1-1.06 0l-7.5-7.5a.75.75 0 0 1 1.06-1.06L12 14.69l6.97-6.97a.75.75 0 1 1 1.06 1.06l-7.5 7.5Z" clipRule="evenodd" />
                          </svg></span>
                        </button>

                        {dropdownOpen[idx] && (
                                <div
                                  id={`dropdownContent-${idx}`}
                                  className="ml-0 z-10 absolute top-full mt-2 w-[200px] bg-white rounded-lg shadow dark:bg-gray-700 dropdown-menu max-h-48 overflow-y-auto"
                                >
                                  <ul className="p-3 text-sm text-gray-700 dark:text-gray-200" aria-labelledby={`dropdownToggle-${idx}`}>
                                    {updateDropdownOptions(work.work_master).map((employee, empIdx) => (
                                      <li key={empIdx}
                                        className={`cursor-pointer select-none relative py-2 px-4 ${
                                          selectedEmployee[idx] === `${employee.first_name} ${employee.last_name}` ? 'bg-[#F8F9FA]' : 'hover:bg-[#F8F9FA]'
                                        }`}
                                        onClick={() => handleEmployeeSelect(idx, `${employee.first_name} ${employee.last_name}`)}
                                      >
                                        {`${employee.first_name} ${employee.last_name}`}
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                      </td>
                      <td  className="px-4 py-2 whitespace-nowrap">
                      <button
                        type="button"
                        className={`hover:shadow-form rounded-md bg-blue-600 h-[38px] px-5 text-center text-base font-semibold text-white outline-none ${
                          assignEnquiry?.session_user_role === 'Accountant' ? 'cursor-not-allowed opacity-70' : ''
                        }`}
                        onClick={() => handleAssignWorkTask(assignEnquiry?.work_id, work.work_master, selectedEmployee[idx]?.split(' ')[0] ?? '', selectedEmployee[idx]?.split(' ')[1] ?? '')}
                        disabled={assignEnquiry?.session_user_role === 'Accountant'}
                      >
                        <i className="fa-solid fa-circle-plus mr-2"></i> Assign
                      </button>

                      <button
                        type="button"
                        className={`hover:shadow-form rounded-md bg-blue-600 py-1.5 h-[38px] px-5 ml-5 text-center text-base font-semibold text-white outline-none ${
                          !selectedEmployee[idx] || selectedEmployee[idx] === 'Select Employee' || assignEnquiry?.session_user_role === 'Accountant' ? 'cursor-not-allowed opacity-70' : ''
                        }`}
                        onClick={() => handleRevokeWorkTask(assignEnquiry.work_id, work.work_master)}
                        disabled={!selectedEmployee[idx] || selectedEmployee[idx] === 'Select Employee' || assignEnquiry?.session_user_role === 'Accountant'}
                      >
                        <i className="fa-solid fa-circle-minus mr-2"></i> Revoke
                      </button>

                </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
      
    </div>
  </div>
)}


   

          </div>
        </div>
      </div>
    </div>
  );
};

export default Work;
