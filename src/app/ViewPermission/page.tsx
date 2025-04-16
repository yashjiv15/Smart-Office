// src/pages/ViewPermission.tsx
"use client"

import React, { useEffect, useState } from 'react';
import Header from '../../components/Header';
import SideBar from '../../components/SideBar';
import Link from 'next/link';
import { faShieldAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { viewRoles, RoleData,addRolePermission,RolePermissionData, viewRolePermissions } from '../../apiService'; // Import the viewRoles function and RoleData interface
import { addPermission, updatePermission, ViewPermissionData, viewPermissions, deletePermission  } from '../../apiService';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { usePermissions } from '../../context/PermissionContext';
import { redirect } from 'next/navigation';


const ViewPermission = () => {

  useEffect(() => {
    const sessionEmail = localStorage.getItem('sessionEmail');
    if (!sessionEmail) {
      redirect('/UserLogin'); // Redirect to a 404 page or your desired route
    }
  }, []);
  
  const { permissions: userPermissions } = usePermissions();

  const [selectedRole, setSelectedRole] = useState<string>("");
  const [roles, setRoles] = useState<RoleData[]>([]); // State to store roles
  const [selectedPermissions, setSelectedPermissions] = useState<Record<string, Record<string, boolean>>>({});


  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10); // Number of items per page
  const [formData, setFormData] = useState<{ permission_title: string; new_permission_title: string }>({
    permission_title: '',
    new_permission_title: ''
  });
    const [errors, setErrors] = useState({ permission_title: '', new_permission_title: '', formError: '' });
  const [permissions, setPermissions] = useState<ViewPermissionData[]>([]);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);

  // Calculate pagination
  const permissionTitles = Object.keys(permissions);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = permissionTitles.slice(indexOfFirstItem, indexOfLastItem);

  // Change page
  const paginate = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  useEffect(() => {
    const fetchPermissions = async () => {
      try {
        const response = await viewPermissions();
        setPermissions(response);
        setSelectedPermissions(
          Object.keys(response).reduce((acc, title) => {
            acc[title] = response[title].reduce((innerAcc, perm) => {
              innerAcc[perm] = false;
              return innerAcc;
            }, {});
            return acc;
          }, {})
        );
      } catch (error) {
        console.error("Error fetching permissions:", error);
      }
    };

    const fetchRoles = async () => {
      try {
        const rolesResponse = await viewRoles();
        setRoles(rolesResponse);
      } catch (error) {
        console.error("Error fetching roles:", error);
      }
    };

    fetchPermissions();
    fetchRoles();
  }, []);

  const handleRoleChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedRole = event.target.value;
    setSelectedRole(selectedRole);
  
    try {
      const response = await viewRolePermissions(selectedRole);
      setSelectedPermissions((prev) => {
        // Reset all permissions and then set the selected ones
        const updatedPermissions = { ...prev };
        Object.keys(updatedPermissions).forEach((title) => {
          Object.keys(updatedPermissions[title]).forEach((perm) => {
            updatedPermissions[title][perm] = response.permissions.includes(perm);
          });
        });
        return updatedPermissions;
      });
    } catch (error) {
      console.error("Error fetching role permissions:", error);
    }
  };
  

  const handleAdd = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    resetForm();
  };

  const resetForm = () => {
    setFormData({ permission_title: "",new_permission_title:"" });
    setErrors({ permission_title: "", formError: "",new_permission_title:"" });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  

  const toTitleCase = (str: string): string => {
    return str
      .toLowerCase()
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const validateForm = () => {
    let valid = true;
    let newErrors = { permission_title: "", new_permission_title: "", formError: "" };
  
    if (!formData.permission_title) {
      newErrors.permission_title = "Permission title is required";
      valid = false;
    }
  
    if (isUpdateModalOpen && !formData.new_permission_title) {
      newErrors.new_permission_title = "New permission title is required";
      valid = false;
    }
  
    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }

    // Trim and convert permission title to title case before saving
    formData.permission_title = toTitleCase(formData.permission_title.trim());

    try {
      await addPermission(formData);
      toast.success("Permission added successfully");
      resetForm();
      setIsModalOpen(false);

      // Fetch permissions again after submitting the form
      const fetchPermissions = async () => {
        try {
          const response = await viewPermissions();
          setPermissions(response);
          setSelectedPermissions(
            Object.keys(response).reduce((acc, title) => {
              acc[title] = response[title].reduce((innerAcc, perm) => {
                innerAcc[perm] = false;
                return innerAcc;
              }, {});
              return acc;
            }, {})
          );
        } catch (error) {
          console.error("Error fetching permissions:", error);
        }
      };
      fetchPermissions();
    } catch (error) {
      setErrors((prevErrors) => ({ ...prevErrors, formError: error.message }));
      toast.error("Error adding permission");
    }
  };

  const handleSelectAll = (event) => {
    const { checked } = event.target;
    const updatedSelections = Object.keys(selectedPermissions).reduce(
      (acc, title) => {
        acc[title] = Object.keys(selectedPermissions[title]).reduce(
          (innerAcc, perm) => {
            innerAcc[perm] = checked;
            return innerAcc;
          },
          {}
        );
        return acc;
      },
      {}
    );
    setSelectedPermissions(updatedSelections);
  };

  const handleCheckboxChange = (title: string, permission: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedPermissions((prev) => ({
      ...prev,
      [title]: {
        ...prev[title],
        [permission]: event.target.checked,
      },
    }));
  };


  const handleUpdatePopup = (index: number) => {
    const selectedPermission = currentItems[index];
    setFormData({ 
      permission_title: selectedPermission,
      new_permission_title: selectedPermission 
    });
    setErrors({ permission_title: "", new_permission_title: "", formError: "" }); // Reset errors
    setIsUpdateModalOpen(true);
  };
  

  

  const handleCloseUpdateModal = () => {
    setIsUpdateModalOpen(false);
    resetForm();
  };

  const handleModalCloseAndReset = () => {
    handleCloseUpdateModal();
    resetForm();
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }
  
    const updatedData = {
      permission_title: formData.permission_title,
      new_permission_title: toTitleCase(formData.new_permission_title.trim()),
    };
  
    try {
      await updatePermission(updatedData);
      toast.success('Permission updated successfully');
      handleModalCloseAndReset();
      await fetchPermissions();
    } catch (error) {
      console.error('Error updating permission:', error.response || error);
      toast.error('Error updating permission: ' + error.message);
    }
  };
  

  const fetchPermissions = async () => {
    try {
      const response = await viewPermissions();
      setPermissions(response);
      setSelectedPermissions(
        Object.keys(response).reduce((acc, title) => {
          acc[title] = response[title].reduce((innerAcc, perm) => {
            innerAcc[perm] = false;
            return innerAcc;
          }, {});
          return acc;
        }, {})
      );
    } catch (error) {
      console.error("Error fetching permissions:", error);
    }
  };

  const handleDelete = async (permissionTitle: string) => {
    
      try {
        await deletePermission(permissionTitle);
        toast.success("Permission deleted successfully");
        fetchPermissions();
      } catch (error) {
        console.error("Error deleting permission:", error);
        toast.error("Error deleting permission: " + error.message);
      }
    
  };

  const handleResetAll = () => {
    setSelectedPermissions(
      Object.keys(permissions).reduce((acc, title) => {
        acc[title] = permissions[title].reduce((innerAcc, perm) => {
          innerAcc[perm] = false;
          return innerAcc;
        }, {});
        return acc;
      }, {})
    );
    setSelectedRole(""); // Reset radio buttons
  };

  const handleSubmitPermissions = async () => {
    if (!selectedRole) {
      toast.error("Please select a role");
      return;
    }

    const permissionsToAssign: string[] = [];

    for (const title in selectedPermissions) {
      for (const permission in selectedPermissions[title]) {
        if (selectedPermissions[title][permission]) {
          permissionsToAssign.push(permission);
        }
      }
    }

    const rolePermissionData: RolePermissionData = {
      role_name: selectedRole,
      permissions: permissionsToAssign,
    };

    try {
      await addRolePermission(rolePermissionData);
      toast.success("Permissions assigned successfully");
      // handleResetAll();
    } catch (error) {
      toast.error("Error assigning permissions: " + error.message);
    }
  };
  
  

  return (
    <div className="bg-[#F8F9FA] min-h-screen overflow-hidden">
      <Header />
      <ToastContainer />
      <div className="flex">
        <SideBar />
        <div className="flex-grow p-12 py-0 mt-2 ml-52 max-h-[85vh] overflow-hidden">
          <div className="mx-auto w-full bg-white p-8 rounded-2xl">
            
            <div>
            {userPermissions.includes('create_permissions') && (
          <button
                type="button"
                className="hover:shadow-form rounded-md bg-blue-600 py-1.5 h-[38px]  px-5 mb-5 text-center text-base font-semibold text-white outline-none"
                onClick={handleAdd}
              >
                <i className="fa-solid fa-circle-plus mr-2"></i>Add New Permission
              </button>
              )}
            </div>
            {userPermissions.includes('view_permissions') && (
            <div className="flex justify-between">
            <div className="mb-5 flex items-center space-x-3">
                <h2 className="text-xl font-semibold mb-1">Roles</h2>
                {roles.map((role) => (
                  <label key={role.role_id} className="flex items-center space-x-1">
                    <input
                      type="radio"
                      value={role.role_name}
                      checked={selectedRole === role.role_name}
                      onChange={handleRoleChange}
                    />
                    <span>{role.role_name}</span>
                  </label>
                ))}
              </div>
            <div className="flex items-center space-x-2">
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    onChange={handleSelectAll}
                  />
                  <div className="group peer ring-0 bg-gradient-to-bl from-neutral-800 via-neutral-700 to-neutral-600 rounded-full outline-none duration-1000 after:duration-300 w-16 h-6 shadow-md peer-focus:outline-none after:content-[''] after:rounded-full after:absolute peer-checked:after:rotate-180 after:[background:conic-gradient(from_135deg,_#b2a9a9,_#b2a8a8,_#ffffff,_#d7dbd9_,_#ffffff,_#b2a8a8)] after:outline-none after:h-5 after:w-5 after:top-0.5 after:left-2 peer-checked:after:translate-x-7 peer-hover:after:scale-95"></div>
                </label>
                <span className="text-base">Select All</span>
              </div>
            </div>
            )}
            {userPermissions.includes('view_permissions') && (
            <div className="overflow-x-auto">
  <table className="min-w-full divide-y divide-gray-200">
    <thead className="bg-blue-600">
      <tr>
        <th
          scope="col"
          className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider whitespace-nowrap"
        >
          Permission Title
        </th>
        <th
          scope="col"
          className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider whitespace-nowrap"
        >
          Create
        </th>
        <th
          scope="col"
          className="px-7 py-3 text-left text-xs font-medium text-white uppercase tracking-wider whitespace-nowrap"
        >
          Update
        </th>
        <th
          scope="col"
          className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider whitespace-nowrap"
        >
          View
        </th>
        <th
          scope="col"
          className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider whitespace-nowrap"
        >
          Delete
        </th>
        <th 
           scope="col" 
           className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider whitespace-nowrap"
        >&nbsp;&nbsp;&nbsp;
          Actions
        </th>
      </tr>
    </thead>
    <tbody className="bg-white divide-y divide-gray-200">
      {Object.keys(permissions).map((title, index) => (
        <tr key={index}>
          <td className="px-6 py-4 whitespace-nowrap">{title}</td>
          {permissions[title].map((permission) => (
            <td
              key={permission}
              className="px-10 py-2 whitespace-nowrap"
            >
              <input
                className="form-checkbox h-4 w-4 text-blue-600"
                type="checkbox"
                checked={selectedPermissions[title]?.[permission] || false}
                onChange={handleCheckboxChange(title, permission)}
              />
            </td>
          ))}
          <td className="px-6 py-3 whitespace-nowrap">
            <div className="flex space-x-4">
            {userPermissions.includes('update_permissions') && (
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
            {userPermissions.includes('delete_permissions') && (
              <div className="tooltip" data-tip="Delete">
                <a
                  className="flex items-center rounded-md px-2 py-0 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                  onClick={() => handleDelete(title)} // replace with your delete handler
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
  
  {/* Pagination */}
  <nav className="flex items-center justify-between mt-4">
  <div>
    <span className="text-sm font-normal text-gray-500">
      Showing <span className="font-semibold">{Math.min(indexOfFirstItem + 1, permissionTitles.length)}</span>-
      <span className="font-semibold">{Math.min(indexOfLastItem, permissionTitles.length)}</span> of{' '}
      <span className="font-semibold">{permissionTitles.length}</span>&nbsp;entries
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
      {Array.from({ length: Math.ceil(permissionTitles.length / itemsPerPage) }, (_, index) => (
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
          disabled={currentPage === Math.ceil(permissionTitles.length / itemsPerPage)}
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

  <div className="flex justify-center items-center font-roboto">
    <button
      type="submit"
      className="hover:shadow-form rounded-md bg-blue-600 py-3 px-5 mt-10 text-center text-base font-semibold text-white outline-none"
      onClick={handleSubmitPermissions}
    >
      <i className="fas fa-check mr-2"></i>
      Submit
    </button>
    <button
      type="reset"
      className="hover:shadow-form rounded-md bg-blue-600 py-3 px-5 mt-10 ml-10 text-center text-base font-semibold text-white outline-none"
      onClick={handleResetAll}
    >
      <i className="fas fa-redo mr-2"></i>
      Reset
    </button>
    <Link href="/Dashboard">
      <button
        type="button"
        className="hover:shadow-form rounded-md bg-blue-600 py-3 px-5 mt-10 ml-10 text-center text-base font-semibold text-white outline-none"
      >
        <i className="fas fa-times mr-2"></i>
        Cancel
      </button>
    </Link>
  </div>
</div>
            )}

 {/* Add Permission Modal */}
 {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-auto bg-gray-900 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-8 w-96 rounded-lg">
            <div className="flex justify-between items-center mt-0">
              <h2 className="text-lg font-semibold mb-4">Add New Permission</h2>
              <i className="fas fa-times -mr-4 -mt-16" onClick={handleCloseModal}></i>
            </div>
            <form>
              <label htmlFor="permission_title" className="mb-2 block text-base font-medium text-[#07074D]">Permission</label>
              <div className="flex mb-4">
                <span className="inline-flex items-center px-3 text-sm text-gray-900 bg-gray-200 border border-e-0 border-gray-300 rounded-s-md dark:bg-gray-600 dark:text-gray-400 dark:border-gray-600">
                  <FontAwesomeIcon icon={faShieldAlt} className="text-lg" />
                </span>
                <input
                  type="text"
                  className="flex-1 min-w-0 w-full text-sm p-2.5 rounded-md border mb-0 bg-white py-3 px-2 font-medium text-[#6B7280] outline-none focus:border-blue-600 focus:shadow-md"
                  placeholder="Enter Permission Title"
                  id="permission_title"
                  name="permission_title"
                  value={formData.permission_title}
                  onChange={handleChange}
                />
              </div>
              {errors.permission_title && <p className="text-red-500 text-xs mt-0">{errors.permission_title}</p>}
              {errors.formError && <p className="text-red-500 text-xs mt-0">{errors.formError}</p>}
              <div className="flex justify-around mt-10">
                <button
                  type="button"
                  className="hover:shadow-form rounded-md bg-blue-600 py-1.5 h-[38px] px-5 text-center text-base font-semibold text-white outline-none"
                  onClick={handleCloseModal}
                >
                  <i className="fas fa-times mr-2"></i>
                  Cancel
                </button>
                <button
                  type="button"
                  className="hover:shadow-form rounded-md bg-blue-600 py-1.5 h-[38px] px-5 text-center text-base font-semibold text-white outline-none"
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

      {/* Edit Permission Modal */}
      {isUpdateModalOpen && (
        <div className="fixed inset-0 z-50 overflow-auto bg-gray-900 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-8 w-96 rounded-lg">
            <div className="flex justify-between items-center mt-0">
              <h2 className="text-lg font-semibold mb-4">Update Permission</h2>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6 -mr-4 -mt-14" onClick={handleModalCloseAndReset}>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg> 
            </div>
            <form onSubmit={handleUpdate}>
              <label htmlFor="permission_title" className="mb-2 block text-base font-medium text-[#07074D]">Permission</label>
              <div className="flex mb-4">
                <span className="inline-flex items-center px-3 text-sm text-gray-900 bg-gray-200 border border-e-0 border-gray-300 rounded-s-md dark:bg-gray-600 dark:text-gray-400 dark:border-gray-600">
                  <FontAwesomeIcon icon={faShieldAlt} className="text-lg" />
                </span>
                <input 
  type="text" 
  className="flex-1 min-w-0 w-full text-sm p-2.5 rounded-md border mb-0 bg-white py-3 px-2 font-medium text-[#6B7280] outline-none focus:border-blue-600 focus:shadow-md" 
  id="new_permission_title"
  name="new_permission_title"
  value={formData.new_permission_title}
  onChange={handleChange} 
/>

              </div>
              {errors.permission_title && <p className="text-red-500 text-xs mt-0">{errors.permission_title}</p>}
              <div className="flex justify-around mt-10">
                <button
                  type="button"
                  className="hover:shadow-form rounded-md bg-blue-600 py-1.5 h-[38px] px-5 text-center text-base font-semibold text-white outline-none"
                  onClick={handleModalCloseAndReset}
                >
                  <i className="fas fa-times mr-2"></i> Cancel
                </button>
                <button
                  type="submit"
                  className="hover:shadow-form rounded-md bg-blue-600 py-1.5 h-[38px] px-5 text-center text-base font-semibold text-white outline-none"
                >
                  <i className="fas fa-check mr-2"></i> Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewPermission;